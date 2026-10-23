import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createPreviewServer } from './serve.mjs';
import { getCohesionShadcnTokens } from '../theme/create-shadcn-theme.mjs';

// Verify the served build and its rendered interaction states. Comparing only
// generated CSS with its JSON source would miss alpha-based hover regressions.
const root = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = resolve(root, '.impeccable/review');
if (process.argv.length > 2) throw new Error('verify-shadcn-brand.mjs does not accept arguments.');
await mkdir(outputDirectory, { recursive: true });
const snapshot = JSON.parse(await readFile(resolve(root, 'theme/shadcn-tokens.json'), 'utf8'));
const report = { startedAt: new Date().toISOString(), baseUrl: null, checks: [], browserErrors: [] };
let baseUrl = process.env.COHESION_PREVIEW_URL?.replace(/\/$/, '');
let server;
let browser;

async function test(name, run) {
  try {
    const evidence = await run();
    report.checks.push({ name, passed: true, ...(evidence ? { evidence } : {}) });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({ name, passed: false, error: error.stack || error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

function composite(foreground, background) {
  const alpha = foreground[3] + background[3] * (1 - foreground[3]);
  if (!alpha) return [0, 0, 0, 0];
  return [...foreground.slice(0, 3).map((channel, index) =>
    (channel * foreground[3] + background[index] * background[3] * (1 - foreground[3])) / alpha), alpha];
}

function luminance(color) {
  const channels = color.slice(0, 3).map(channel => channel / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground, background) {
  const renderedForeground = composite(foreground, background);
  const first = luminance(renderedForeground), second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function sameColor(actual, expected, description) {
  assert.ok(actual.every((channel, index) => Math.abs(channel - expected[index]) <= (index === 3 ? 0.01 : 1.05)),
    `${description}: received ${JSON.stringify(actual)}; expected ${JSON.stringify(expected)}`);
}

function minimumContrast(foreground, background, minimum, description) {
  const ratio = contrast(foreground, background);
  assert.ok(ratio >= minimum, `${description}: ${ratio.toFixed(3)}:1 is below ${minimum}:1`);
  return Number(ratio.toFixed(3));
}

// A canvas converts Chromium's rgb/oklch/color-mix output into the same sRGB
// space as the actual screenshot, avoiding string-format comparisons.
async function rendered(locator, expected = {}) {
  return locator.evaluate((element, expectedColors) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const rgba = value => {
      if (!CSS.supports('color', value)) throw new Error(`Unsupported CSS color: ${value}`);
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const pixels = [...context.getImageData(0, 0, 1, 1).data];
      return [...pixels.slice(0, 3), pixels[3] / 255];
    };
    const over = (foreground, background) => {
      const alpha = foreground[3] + background[3] * (1 - foreground[3]);
      if (!alpha) return [0, 0, 0, 0];
      return [...foreground.slice(0, 3).map((channel, index) =>
        (channel * foreground[3] + background[index] * background[3] * (1 - foreground[3])) / alpha), alpha];
    };
    const ancestorColors = [];
    let ancestor = element.parentElement || element.getRootNode().host;
    while (ancestor) {
      ancestorColors.unshift(rgba(getComputedStyle(ancestor).backgroundColor));
      ancestor = ancestor.parentElement || ancestor.getRootNode().host;
    }
    const behind = ancestorColors.reduce((background, foreground) => over(foreground, background), [255, 255, 255, 1]);
    const style = getComputedStyle(element);
    const ringValue = style.getPropertyValue('--tw-ring-color').trim();
    const shadows = [];
    let depth = 0, start = 0;
    const shadowText = `${style.boxShadow},`;
    for (let index = 0; index < shadowText.length; index += 1) {
      if (shadowText[index] === '(') depth += 1;
      else if (shadowText[index] === ')') depth -= 1;
      else if (shadowText[index] === ',' && depth === 0) {
        const part = shadowText.slice(start, index).trim();
        start = index + 1;
        const color = part.match(/(?:rgba?|oklch|oklab|color|lab|lch|hsl|hsla)\([^)]*\)/)?.[0];
        if (!color) continue;
        const lengths = [...part.replace(color, '').matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(match => Number(match[1]));
        shadows.push({ color: rgba(color), lengths, inset: /\binset\b/.test(part) });
      }
    }
    return {
      color: rgba(style.color),
      fill: rgba(style.backgroundColor),
      background: over(rgba(style.backgroundColor), behind),
      behind,
      border: rgba(style.borderTopColor),
      boxShadow: style.boxShadow,
      shadows,
      ring: ringValue && CSS.supports('color', ringValue) ? rgba(ringValue) : null,
      focusVisible: element.matches(':focus-visible'),
      checked: element.getAttribute('aria-checked'),
      state: element.dataset.state,
      expected: Object.fromEntries(Object.entries(expectedColors).map(([key, value]) => [key, rgba(value)])),
    };
  }, expected);
}

async function stableState(locator, expected, properties, description) {
  let evidence;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    evidence = await rendered(locator, expected);
    try {
      for (const [property, token] of Object.entries(properties)) {
        sameColor(evidence[property], evidence.expected[token], `${description} ${property}`);
      }
      return evidence;
    } catch (error) {
      if (attempt === 39) throw error;
      await locator.page().waitForTimeout(30);
    }
  }
  return evidence;
}

async function buttonStates(page, locator, tokens, roles, description) {
  await locator.scrollIntoViewIfNeeded();
  const evidence = {};
  const inspect = async state => {
    const expected = { foreground: tokens[roles.foreground], state: tokens[roles[state]] };
    const result = await stableState(locator, expected,
      roles.text ? { color: 'state' } : { fill: 'state', color: 'foreground' }, `${description} ${state}`);
    const ratio = minimumContrast(result.color, result.background, 4.5, `${description} ${state} text`);
    evidence[state] = { color: result.color, fill: result.fill, background: result.background, contrast: ratio };
  };
  await page.mouse.move(1, 1);
  await inspect('default');
  await locator.hover();
  await inspect('hover');
  await page.mouse.down();
  try {
    await inspect('active');
  } finally {
    // Disarm the real action before releasing: no external link, confirmation
    // dialog or loading state is triggered merely to inspect :active colors.
    await page.mouse.move(1, 1);
    await page.mouse.up();
  }
  return evidence;
}

async function setMode(page, mode) {
  await page.getByRole('button', { name: '选择主题', exact: true }).click();
  await page.getByRole('menuitem').filter({ hasText: mode === 'light' ? '浅色主题' : '深色主题' }).click();
  await page.waitForFunction(expected => document.documentElement.dataset.theme === expected, mode);
  await page.locator('.ant-dropdown').filter({ hasText: '跟随系统' }).waitFor({ state: 'hidden' });
}

async function keyboardFocus(locator, description) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await locator.evaluate(element => element.matches(':focus'))) return;
    await locator.page().waitForTimeout(30);
  }
  assert.fail(`${description}: the expected menu item did not receive keyboard focus`);
}

async function compareTokens(page, actual, expected, description) {
  const canonical = await page.evaluate(values => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    return values.map(value => {
      if (!CSS.supports('color', value)) return value.replace(/\b0\.(\d+)/g, '.$1').replace(/\s+/g, ' ').trim();
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    });
  }, [...Object.values(actual), ...Object.values(expected)]);
  const roles = Object.keys(expected);
  assert.deepEqual(Object.keys(actual), roles, `${description} role names differ`);
  roles.forEach((role, index) => assert.deepEqual(canonical[index], canonical[index + roles.length], `${description} --${role} differs`));
}

try {
  if (!baseUrl) {
    server = await createPreviewServer();
    await new Promise((resolveListen, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolveListen);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  }
  report.baseUrl = baseUrl;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'no-preference' });
  await context.addInitScript(() => localStorage.setItem('zk-theme', 'light'));
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  page.on('pageerror', error => report.browserErrors.push({ kind: 'pageerror', message: error.message, url: page.url() }));
  page.on('console', message => {
    if (message.type() === 'error') report.browserErrors.push({ kind: 'console.error', message: message.text(), url: page.url() });
  });
  await page.goto(`${baseUrl}/#shadcn?tab=components`);
  const view = page.locator('[data-shadcn-view]');
  const scope = view.locator('.shadcn-scope').first();
  await view.waitFor();
  await page.waitForFunction(() => document.documentElement.dataset.theme && document.documentElement.dataset.density);

  await test('shared brand factory, snapshot, public JSON and public CSS agree', async () => {
    const [jsonResponse, cssResponse] = await Promise.all([
      page.request.get(`${baseUrl}/theme/shadcn-tokens.json`),
      page.request.get(`${baseUrl}/preview/shadcn/tokens.css`),
    ]);
    assert.equal(jsonResponse.status(), 200, 'public theme JSON is unavailable');
    assert.equal(cssResponse.status(), 200, 'public theme CSS is unavailable');
    const publicSnapshot = await jsonResponse.json();
    assert.deepEqual(publicSnapshot, snapshot, 'served snapshot differs from the workspace snapshot');
    const publicCss = await cssResponse.text();
    const cssModes = await page.evaluate(css => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      return Object.fromEntries(['light', 'dark'].map(mode => {
        const rule = [...sheet.cssRules].find(rule => rule.selectorText?.includes(`[data-shadcn-theme="${mode}"]`));
        if (!rule) throw new Error(`Missing public CSS ${mode} selector`);
        return [mode, Object.fromEntries([...rule.style].filter(property => property.startsWith('--'))
          .map(property => [property.slice(2), rule.style.getPropertyValue(property).trim()]))];
      }));
    }, publicCss);
    const roles = {};
    for (const mode of ['light', 'dark']) {
      const tokens = getCohesionShadcnTokens({ mode });
      assert.deepEqual(snapshot[mode], tokens, `${mode} generated snapshot differs from the shared factory`);
      await compareTokens(page, cssModes[mode], tokens, `${mode} public CSS`);
      roles[mode] = Object.keys(tokens).length;
    }
    return roles;
  });

  for (const mode of ['light', 'dark']) {
    await setMode(page, mode);
    const tokens = getCohesionShadcnTokens({ mode });
    await page.waitForFunction(expected => {
      const host = document.querySelector('[data-shadcn-view] [data-shadcn-host]');
      if (host?.shadowRoot?.querySelector('.shadcn-scope')?.dataset.shadcnTheme === expected) return true;
      // The public host marker is optional: find the same open ShadowRoot by
      // traversing the actual preview surface, without a production test hook.
      const find = root => [...root.querySelectorAll('*')].some(element =>
        element.shadowRoot && (element.shadowRoot.querySelector(`.shadcn-scope[data-shadcn-theme="${expected}"]`) || find(element.shadowRoot)));
      return find(document.querySelector('[data-shadcn-view]'));
    }, mode);

    await test(`shadcn ${mode}: rendered scope receives every shared semantic role`, async () => {
      const actual = await scope.evaluate((element, roles) => {
        const style = getComputedStyle(element);
        return Object.fromEntries(roles.map(role => [role, style.getPropertyValue(`--${role}`).trim()]));
      }, Object.keys(tokens));
      await compareTokens(page, actual, tokens, `${mode} rendered scope`);
      return { mode, roles: Object.keys(tokens).length };
    });

    await test(`shadcn ${mode}: primary button default, hover and active stay readable`, () =>
      buttonStates(page, view.getByRole('button', { name: '保存演示草稿', exact: true }), tokens,
        { default: 'primary', hover: 'primary-hover', active: 'primary-active', foreground: 'primary-foreground' }, `${mode} primary button`));

    await test(`shadcn ${mode}: destructive button default, hover and active keep white foreground`, async () => {
      const result = await buttonStates(page, view.getByRole('button', { name: '删除演示草稿', exact: true }), tokens,
        { default: 'destructive-solid', hover: 'destructive-hover', active: 'destructive-active', foreground: 'destructive-foreground' }, `${mode} destructive button`);
      for (const [state, evidence] of Object.entries(result)) sameColor(evidence.color, [255, 255, 255, 1], `${mode} destructive ${state} white foreground`);
      return result;
    });

    await test(`shadcn ${mode}: link default, hover and active follow readable text roles`, () =>
      buttonStates(page, view.getByRole('link', { name: '按钮规范', exact: true }), tokens,
        { default: 'link', hover: 'link-hover', active: 'link-active', foreground: 'foreground', text: true }, `${mode} button link`));

    await test(`shadcn ${mode}: checked Switch and Checkbox use the brand pair`, async () => {
      const evidence = {};
      const switchControl = view.getByRole('switch', { name: '接收产品更新', exact: true });
      if (await switchControl.getAttribute('aria-checked') !== 'true') await switchControl.click();
      const switchStyle = await stableState(switchControl, { primary: tokens.primary }, { fill: 'primary' }, `${mode} checked Switch`);
      const thumb = await rendered(switchControl.locator('[data-slot="switch-thumb"]'), { foreground: tokens['primary-foreground'] });
      sameColor(thumb.fill, thumb.expected.foreground, `${mode} Switch thumb foreground`);
      evidence.switch = { fill: switchStyle.fill, thumb: thumb.fill, contrast: minimumContrast(thumb.fill, switchStyle.background, 4.5, `${mode} Switch thumb`) };
      const checkbox = view.getByRole('checkbox', { name: 'Web 工作台', exact: true });
      if (await checkbox.getAttribute('aria-checked') !== 'true') await checkbox.click();
      const checkedStyle = await stableState(checkbox, { primary: tokens.primary, foreground: tokens['primary-foreground'] },
        { fill: 'primary', border: 'primary', color: 'foreground' }, `${mode} checked Checkbox`);
      evidence.checkbox = { fill: checkedStyle.fill, color: checkedStyle.color, contrast: minimumContrast(checkedStyle.color, checkedStyle.background, 4.5, `${mode} Checkbox indicator`) };
      return evidence;
    });

    await test(`shadcn ${mode}: keyboard Input focus renders a solid brand ring`, async () => {
      const input = view.getByRole('textbox', { name: '空间名称', exact: true });
      await input.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      let evidence;
      for (let attempt = 0; attempt < 40; attempt += 1) {
        evidence = await rendered(input, { ring: tokens.ring });
        const ringShadow = evidence.shadows.find(shadow => !shadow.inset && shadow.lengths[3] >= 3 && shadow.color[3] === 1 &&
          shadow.color.every((channel, index) => Math.abs(channel - evidence.expected.ring[index]) <= (index === 3 ? 0.01 : 1.05)));
        if (evidence.focusVisible && evidence.ring?.[3] === 1 && ringShadow) break;
        await page.waitForTimeout(30);
      }
      assert.ok(evidence.focusVisible, 'Input is not visibly keyboard focused');
      assert.ok(evidence.ring, 'Input has no resolved focus ring color');
      sameColor(evidence.ring, evidence.expected.ring, `${mode} focus ring role`);
      assert.equal(evidence.ring[3], 1, 'Input focus ring is translucent');
      assert.notEqual(evidence.boxShadow, 'none', 'Input focus ring is absent from the actual box-shadow');
      const ringShadow = evidence.shadows.find(shadow => !shadow.inset && shadow.lengths[3] >= 3 && shadow.color[3] === 1 &&
        shadow.color.every((channel, index) => Math.abs(channel - evidence.expected.ring[index]) <= (index === 3 ? 0.01 : 1.05)));
      assert.ok(ringShadow, 'Input has no settled 3px solid ring in its rendered box-shadow');
      const ratio = minimumContrast(ringShadow.color, evidence.behind, 3, `${mode} Input focus ring against surrounding surface`);
      return { ring: evidence.ring, surface: evidence.behind, boxShadow: evidence.boxShadow, contrast: ratio };
    });

    await test(`shadcn ${mode}: keyboard menu highlight uses readable brand accent`, async () => {
      const trigger = view.getByRole('button', { name: '更多空间操作', exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');
      const item = page.getByRole('menuitem', { name: '复制空间名称', exact: true });
      await item.waitFor();
      try {
        await keyboardFocus(item, `${mode} Enter opens the menu at its first enabled item`);
        const lastItem = page.getByRole('menuitem', { name: '导出演示配置', exact: true });
        for (const [key, target] of [['End', lastItem], ['Home', item], ['ArrowDown', lastItem], ['ArrowUp', item]]) {
          await page.keyboard.press(key);
          await keyboardFocus(target, `${mode} menu ${key}`);
        }
        const evidence = await stableState(item, { accent: tokens.accent, foreground: tokens['accent-foreground'] },
          { fill: 'accent', color: 'foreground' }, `${mode} highlighted menu item`);
        const ratio = minimumContrast(evidence.color, evidence.background, 4.5, `${mode} menu accent text`);
        return { fill: evidence.fill, color: evidence.color, contrast: ratio };
      } finally {
        await page.keyboard.press('Escape');
        await item.waitFor({ state: 'hidden' });
        await keyboardFocus(trigger, `${mode} menu Escape restores its trigger`);
      }
    });

    await test(`shadcn ${mode}: Select Escape restores its keyboard trigger`, async () => {
      const trigger = view.getByLabel('业务类型', { exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');
      const listbox = page.getByRole('listbox');
      await listbox.waitFor();
      await page.keyboard.press('Escape');
      await listbox.waitFor({ state: 'hidden' });
      await keyboardFocus(trigger, `${mode} Select Escape restores its trigger`);
      return { focusReturned: true };
    });
  }
  await test('brand verification completed without browser runtime errors', async () => assert.deepEqual(report.browserErrors, []));
} catch (error) {
  report.checks.push({ name: 'brand verification setup and navigation', passed: false, error: error.stack || error.message });
  console.error(error.stack || error.message);
} finally {
  await browser?.close();
  if (server) await new Promise(resolveClose => server.close(resolveClose));
  report.finishedAt = new Date().toISOString();
  report.passed = report.checks.every(item => item.passed);
  report.summary = { passed: report.checks.filter(item => item.passed).length, failed: report.checks.filter(item => !item.passed).length };
  const path = resolve(outputDirectory, 'shadcn-brand-validation.json');
  await writeFile(path, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`${report.summary.passed} checks passed; ${report.summary.failed} failed. Report: ${path}`);
  if (!report.passed) process.exitCode = 1;
}
