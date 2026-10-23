import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { createPreviewServer } from './serve.mjs';
import { compositeColor, createCohesionTheme, getCohesionTokens, parseColor } from '../theme/create-theme.mjs';
import shadcnPreset from '../theme/shadcn-tokens.json' with { type: 'json' };

// Exercise the compiled, served preview rather than its React implementation.
// In particular these assertions fail when a light sample inherits the parent
// dark Button.primaryColor, even though its own algorithm is already light.
const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const screenshots = args.includes('--screenshots') || process.env.COHESION_SCREENSHOTS === '1';
const only = args.find(argument => argument.startsWith('--only='))?.slice('--only='.length);
for (const argument of args) {
  if (argument !== '--screenshots' && !argument.startsWith('--only=')) throw new Error(`Unknown argument: ${argument}`);
}
if (only && !['themes', 'shadcn'].includes(only)) throw new Error('--only must be themes or shadcn.');
const outputDirectory = resolve(root, '.impeccable/review');
await mkdir(outputDirectory, { recursive: true });
const report = { startedAt: new Date().toISOString(), baseUrl: null, checks: [], screenshots: [], browserErrors: [] };
let server;
let browser;
let baseUrl = process.env.COHESION_PREVIEW_URL?.replace(/\/$/, '');

function check(condition, message) { assert.ok(condition, message); }
function canonicalCSS(value) {
  if (/^#[0-9a-f]{3,8}$/i.test(value.trim())) return parseColor(value).join(',');
  const match = value.trim().match(/^oklch\(([^)]+)\)$/i);
  if (match) {
    const [channels, alpha = '1'] = match[1].split('/');
    const percentage = (part, scale = 1) => Number((Number.parseFloat(part) * (part.endsWith('%') ? scale / 100 : 1)).toFixed(8));
    const [lightness, chroma, hue] = channels.trim().split(/\s+/);
    return `oklch(${percentage(lightness)} ${percentage(chroma, 0.4)} ${percentage(hue)} / ${percentage(alpha.trim())})`;
  }
  return value.replace(/\b0\.(\d+)/g, '.$1').replace(/\s+/g, ' ').trim();
}
function approximatelyColor(actual, expected, description) {
  const first = parseColor(actual), second = Array.isArray(expected) ? expected : parseColor(expected);
  check(first.every((channel, index) => Math.abs(channel - second[index]) <= (index === 3 ? 0.01 : 1.05)), `${description}: received ${actual}; expected ${Array.isArray(expected) ? JSON.stringify(expected) : expected}`);
}
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
async function shot(page, name, target) {
  if (!screenshots) return;
  const path = resolve(outputDirectory, name);
  if (!target) await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const preset = /^shadcn-(light|dark)-(desktop|mobile)\.png$/.test(name);
  const originalViewport = page.viewportSize();
  if (preset && name.endsWith('-mobile.png')) await page.setViewportSize({ ...originalViewport, height: 1800 });
  await (target || page).screenshot({ path, ...(target ? {} : { fullPage: !preset && name !== 'shadcn-user-1166.png' }), animations: 'disabled' });
  if (preset && name.endsWith('-mobile.png')) await page.setViewportSize(originalViewport);
  report.screenshots.push(path);
}
async function computed(locator) {
  return locator.evaluate(element => {
    const style = getComputedStyle(element);
    return { color: style.color, backgroundColor: style.backgroundColor, borderColor: style.borderTopColor, borderStyle: style.borderTopStyle, borderWidth: style.borderTopWidth, boxShadow: style.boxShadow, fontSize: style.fontSize, height: element.getBoundingClientRect().height };
  });
}
async function stableColor(locator, property, expected, description) {
  let actual;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    actual = (await computed(locator))[property];
    try { approximatelyColor(actual, expected, description); return; } catch (error) { if (attempt === 29) throw error; }
    await locator.page().waitForTimeout(30);
  }
}
async function noOverflow(page, description) {
  let geometry;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    geometry = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    if (Math.max(geometry.document, geometry.body) <= geometry.viewport + 1) return geometry;
    // Route changes may be followed by an old tooltip's exit animation. Assert
    // the settled responsive layout, with a finite deadline for real overflow.
    await page.waitForTimeout(50);
  }
  check(Math.max(geometry.document, geometry.body) <= geometry.viewport + 1, `${description}: horizontal overflow ${JSON.stringify(geometry)}`);
  return geometry;
}
async function ready(page, hash = 'overview') {
  await page.goto(`${baseUrl}/#${hash}`);
  await page.locator('#main-content').waitFor();
  await page.waitForFunction(() => document.documentElement.dataset.theme && document.documentElement.dataset.density);
}
async function setMode(page, mode) {
  await page.getByRole('button', { name: '选择主题', exact: true }).click();
  await page.getByRole('menuitem').filter({ hasText: mode === 'light' ? '浅色主题' : '深色主题' }).click();
  await page.waitForFunction(expected => document.documentElement.dataset.theme === expected, mode);
  // A theme menu closing at desktop coordinates can briefly extend beyond a
  // newly resized mobile viewport. Finish that real exit before layout checks.
  await page.locator('.ant-dropdown').filter({ hasText: '跟随系统' }).waitFor({ state: 'hidden' });
}
async function setDensity(page, compact) {
  const control = page.locator('.ds-density-control');
  await control.getByText(compact ? '紧凑' : '舒适', { exact: true }).click();
  await page.waitForFunction(expected => document.documentElement.dataset.density === expected, compact ? 'compact' : 'comfortable');
}
function monitor(page) {
  page.on('pageerror', error => report.browserErrors.push({ kind: 'pageerror', message: error.message, url: page.url() }));
  page.on('console', message => {
    if (message.type() === 'error') report.browserErrors.push({ kind: 'console.error', message: message.text(), url: page.url() });
  });
}

async function nestedThemes(page) {
  await ready(page);
  const baselines = new Map();
  for (const compact of [false, true]) {
    await setDensity(page, compact);
    for (const parent of ['light', 'dark']) {
      await setMode(page, parent);
      for (const [index, mode] of ['light', 'dark'].entries()) {
        await test(`nested ${parent}/${compact ? 'compact' : 'comfortable'} -> ${mode}: primary states, secondary, Tag and feedback`, async () => {
          const tokens = getCohesionTokens({ mode, compact });
          const config = createCohesionTheme({ mode, compact });
          const foreground = config.components?.Button?.primaryColor || tokens.colorTextLightSolid;
          const sample = page.locator('.ds-theme-sample').nth(index);
          const primary = sample.getByRole('button', { name: '保存更改', exact: true });
          const secondary = sample.getByRole('button', { name: '次要操作', exact: true });
          await sample.scrollIntoViewIfNeeded();
          await page.mouse.move(1, 1);
          await stableColor(sample, 'backgroundColor', tokens.colorBgContainer, `${mode} sample surface`);
          await stableColor(primary, 'backgroundColor', tokens.colorPrimary, `${mode} primary default fill`);
          await stableColor(primary, 'color', foreground, `${mode} primary foreground`);
          const defaultStyle = await computed(primary);
          check(Math.abs(defaultStyle.height - tokens.controlHeight) < 1, `${mode} primary height follows its compact algorithm (${defaultStyle.height}/${tokens.controlHeight})`);
          await primary.hover();
          await stableColor(primary, 'backgroundColor', tokens.colorPrimaryHover, `${mode} primary hover fill`);
          await stableColor(primary, 'color', foreground, `${mode} primary hover foreground`);
          await page.mouse.down();
          try {
            await stableColor(primary, 'backgroundColor', tokens.colorPrimaryActive, `${mode} primary active fill`);
            await stableColor(primary, 'color', foreground, `${mode} primary active foreground`);
          } finally { await page.mouse.move(1, 1); await page.mouse.up(); }
          await stableColor(secondary, 'backgroundColor', tokens.colorBgContainer, `${mode} secondary fill`);
          await stableColor(secondary, 'color', tokens.colorText, `${mode} secondary foreground`);
          await stableColor(secondary, 'borderColor', tokens.colorBorder, `${mode} secondary border`);
          const tag = sample.locator('.ant-tag').first();
          const tagFill = compositeColor(tokens.colorFillTertiary, tokens.colorBgContainer);
          await stableColor(tag, 'backgroundColor', tagFill, `${mode} neutral Tag fill`);
          await stableColor(tag, 'color', tokens.colorText, `${mode} neutral Tag foreground`);
          const successTag = sample.locator('.ant-tag-success');
          await stableColor(successTag, 'backgroundColor', tokens.colorSuccessBg, `${mode} status Tag fill`);
          await stableColor(successTag, 'color', tokens.colorSuccess, `${mode} status Tag foreground`);
          const signature = { primary: defaultStyle, secondary: await computed(secondary), tag: await computed(tag) };
          const key = `${mode}/${compact}`;
          if (baselines.has(key)) assert.deepEqual(signature, baselines.get(key), `${mode} card changes when only its parent theme changes`);
          else baselines.set(key, signature);
          for (const [trigger, text] of [[primary, '组件交互保持一致'], [secondary, '次要操作使用中性层级']]) {
            // Different nested App holders may render identical copy. Identify
            // the newly mounted notice, not an older matching sibling holder.
            const previous = await page.locator('.ant-message-notice').elementHandles();
            await trigger.click();
            await page.waitForFunction(before => [...document.querySelectorAll('.ant-message-notice')].some(element => !before.includes(element)), previous);
            const position = await page.locator('.ant-message-notice').evaluateAll((elements, before) => elements.findIndex(element => !before.includes(element)), previous);
            const notice = page.locator('.ant-message-notice').nth(position);
            await notice.waitFor({ state: 'visible' });
            check((await notice.textContent()).includes(text), `${mode} local feedback copy mismatch`);
            await stableColor(notice, 'backgroundColor', tokens.colorBgElevated, `${mode} local feedback surface`);
            await stableColor(notice, 'color', tokens.colorText, `${mode} local feedback text`);
            await Promise.all(previous.map(handle => handle.dispose()));
          }
          return { parent, mode, compact, primary: defaultStyle, foreground, surface: tokens.colorBgContainer };
        });
      }
    }
  }
  await test('nested theme isolation survives light -> dark -> light changes', async () => {
    await setDensity(page, false);
    for (const parent of ['light', 'dark', 'light']) {
      await setMode(page, parent);
      for (const [index, mode] of ['light', 'dark'].entries()) {
        const tokens = getCohesionTokens({ mode });
        const foreground = createCohesionTheme({ mode }).components?.Button?.primaryColor || tokens.colorTextLightSolid;
        const primary = page.locator('.ds-theme-sample').nth(index).getByRole('button', { name: '保存更改', exact: true });
        await page.mouse.move(1, 1);
        await stableColor(primary, 'color', foreground, `${parent} parent / ${mode} child primary foreground`);
      }
    }
  });
  await setMode(page, 'dark');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await shot(page, 'nested-themes-dark-desktop.png', page.locator('.ds-theme-comparison').locator('..'));
  await page.setViewportSize({ width: 375, height: 900 });
  await shot(page, 'nested-themes-dark-mobile.png', page.locator('.ds-theme-comparison').locator('..'));
}

async function shadcnChecks(page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page, 'shadcn');
  const view = page.locator('[data-shadcn-view]');
  const scope = view.locator('.shadcn-scope').first();
  await test('shadcn route exposes its own preset and three real tabs', async () => {
    await view.waitFor();
    check(await view.getByRole('tab', { name: '预设与 token', exact: true }).count() === 1, 'token preset tab missing');
    check(await view.getByRole('tab', { name: '组件与状态', exact: true }).count() === 1, 'components tab missing');
    check(await view.getByRole('tab', { name: '产品组合', exact: true }).count() === 1, 'patterns tab missing');
    const tokenValues = await scope.evaluate(element => {
      const style = getComputedStyle(element);
      return Object.fromEntries(['--background', '--foreground', '--primary', '--primary-foreground', '--border', '--radius'].map(key => [key, style.getPropertyValue(key).trim()]));
    });
    check(Object.values(tokenValues).every(Boolean), `shadcn semantic CSS variables missing: ${JSON.stringify(tokenValues)}`);
    return tokenValues;
  });
  for (const mode of ['light', 'dark']) {
    await setMode(page, mode);
    for (const width of [320, 375, 1440]) {
      await test(`shadcn ${mode}/${width}px: semantic preset and overflow`, async () => {
        await page.setViewportSize({ width, height: width < 768 ? 900 : 1000 });
        await view.getByRole('tab', { name: '预设与 token', exact: true }).click();
        await page.waitForFunction(expected => document.documentElement.dataset.theme === expected, mode);
        const colors = await scope.evaluate(element => {
          const style = getComputedStyle(element);
          return { background: style.getPropertyValue('--background').trim(), foreground: style.getPropertyValue('--foreground').trim(), primary: style.getPropertyValue('--primary').trim(), theme: element.dataset.shadcnTheme, density: document.documentElement.dataset.density };
        });
        assert.equal(colors.theme, mode, 'shadcn scope did not follow global theme');
        const roles = Object.keys(shadcnPreset[mode]);
        const actualTokens = await scope.evaluate((element, names) => {
          const style = getComputedStyle(element);
          return Object.fromEntries(names.map(role => [role, style.getPropertyValue(`--${role}`).trim()]));
        }, roles);
        for (const role of roles) assert.equal(canonicalCSS(actualTokens[role]), canonicalCSS(shadcnPreset[mode][role]), `shadcn ${role} diverged from its COHESION theme`);
        const geometry = await noOverflow(page, `shadcn ${mode}/${width}/tokens`);
        if ([375, 1440].includes(width)) await shot(page, `shadcn-${mode}-${width === 1440 ? 'desktop' : 'mobile'}.png`);
        const panels = [{ tab: 'tokens', ...geometry }];
        for (const [name, tab] of [['组件与状态', 'components'], ['产品组合', 'patterns']]) {
          await view.getByRole('tab', { name, exact: true }).click();
          panels.push({ tab, ...await noOverflow(page, `shadcn ${mode}/${width}/${tab}`) });
        }
        return { ...colors, panels };
      });
    }
  }
  await page.setViewportSize({ width: 1166, height: 1228 });
  await view.getByRole('tab', { name: '预设与 token', exact: true }).click();
  await shot(page, 'shadcn-user-1166.png');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await setMode(page, 'light');
  await test('shadcn form rejects invalid email and saves valid data', async () => {
    await view.getByRole('tab', { name: '组件与状态', exact: true }).click();
    await view.getByLabel('空间名称', { exact: true }).fill('验收空间');
    await view.getByLabel('通知邮箱', { exact: true }).fill('invalid-email');
    await view.getByRole('button', { name: '验证并保存', exact: true }).click();
    await view.getByText('请填写完整的通知邮箱', { exact: true }).waitFor();
    check(await view.getByText('演示空间已保存', { exact: true }).count() === 0, 'invalid form was saved');
    await view.getByLabel('通知邮箱', { exact: true }).fill('review@example.com');
    await view.getByRole('button', { name: '验证并保存', exact: true }).click();
    await view.getByText('演示空间已保存', { exact: true }).waitFor();
  });
  await test('shadcn official component borders, shadows and active tab render in ShadowRoot', async () => {
    const elements = {
      card: view.locator('[data-slot="card"]').first(),
      input: view.getByLabel('空间名称', { exact: true }),
      outlineButton: view.getByRole('button', { name: '查看预览', exact: true }),
    };
    const evidence = {};
    for (const [name, element] of Object.entries(elements)) {
      const style = await computed(element);
      assert.equal(style.borderStyle, 'solid', `${name} lost its official solid border in ShadowRoot`);
      assert.equal(style.borderWidth, '1px', `${name} lost its official border width in ShadowRoot`);
      if (name === 'card') check(style.boxShadow !== 'none', 'Card shadow utility lost its initial custom properties in ShadowRoot');
      evidence[name] = style;
    }
    const activeTab = view.getByRole('tab', { name: '组件与状态', exact: true });
    const tabStyle = await computed(activeTab);
    check(!['transparent', 'rgba(0, 0, 0, 0)'].includes(tabStyle.backgroundColor), 'Active Tab lost its distinguishing surface');
    return { ...evidence, activeTab: tabStyle };
  });
  const portalTheme = async (overlay, mode, type) => {
    const evidence = await overlay.evaluate(element => {
      const scope = element.closest('.shadcn-scope');
      const style = getComputedStyle(element);
      return { scoped: Boolean(scope), theme: scope?.dataset.shadcnTheme, background: style.backgroundColor, foreground: style.color };
    });
    check(evidence.scoped, `${type} portal is outside shadcn scope`);
    assert.equal(evidence.theme, mode, `${type} portal inherited a different theme`);
    approximatelyColor(evidence.background, shadcnPreset[mode][type === 'Dialog' ? 'background' : 'popover'], `${type} portal background does not use its own theme`);
    return evidence;
  };
  for (const mode of ['light', 'dark']) {
    await setMode(page, mode);
    await test(`shadcn ${mode} Dialog Escape closes and returns focus`, async () => {
      const trigger = view.getByRole('button', { name: '邀请成员', exact: true });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: '邀请演示成员', exact: true });
      await dialog.waitFor();
      const evidence = await portalTheme(dialog, mode, 'Dialog');
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => {
        let active = document.activeElement;
        while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
        return active?.textContent?.trim() === '邀请成员';
      });
      return evidence;
    });
    await test(`shadcn ${mode} Select and menu portals retain scoped theme`, async () => {
      await view.getByLabel('业务类型', { exact: true }).click();
      const listbox = page.getByRole('listbox');
      await listbox.waitFor();
      const select = await portalTheme(listbox, mode, 'Select');
      await page.keyboard.press('Escape');
      await listbox.waitFor({ state: 'hidden' });
      await view.getByRole('button', { name: '更多空间操作', exact: true }).click();
      const menu = page.getByRole('menu').filter({ has: page.getByRole('menuitem', { name: '复制空间名称', exact: true }) });
      await menu.waitFor();
      const dropdown = await portalTheme(menu, mode, 'Dropdown menu');
      await page.keyboard.press('Escape');
      await menu.waitFor({ state: 'hidden' });
      return { select, dropdown };
    });
  }
  await setMode(page, 'light');
  await shot(page, 'shadcn-components-desktop.png');
  await test('shadcn product composition saves valid preferences', async () => {
    await view.getByRole('tab', { name: '产品组合', exact: true }).click();
    await view.getByLabel('显示名称', { exact: true }).fill('设计团队');
    await view.getByLabel('联系邮箱', { exact: true }).fill('team@example.com');
    await view.getByRole('button', { name: '保存偏好', exact: true }).click();
    await view.getByText('演示偏好已保存到当前浏览器', { exact: true }).waitFor();
  });
  await shot(page, 'shadcn-pattern-desktop.png');
  await test('shadcn motion pause and density contract stay coherent', async () => {
    await view.getByRole('tab', { name: '组件与状态', exact: true }).click();
    const primary = view.getByRole('button', { name: '保存演示草稿', exact: true });
    const before = await computed(primary);
    await setDensity(page, true);
    const after = await computed(primary);
    assert.equal(after.height, before.height, 'Ant Design compact algorithm changed shadcn default control size');
    await view.getByText('当前保留 shadcn/ui 默认尺寸；不使用 Ant Design 的 compactAlgorithm。', { exact: true }).waitFor();
    await page.getByRole('button', { name: '暂停动效', exact: true }).click();
    await page.waitForFunction(() => document.documentElement.dataset.motion === 'reduced');
    assert.equal(await scope.getAttribute('data-motion'), 'paused', 'shadcn scope did not receive paused motion preference');
    await primary.click();
    const spinner = view.getByRole('status', { name: 'Loading', exact: true }).first();
    await spinner.waitFor();
    assert.equal(await spinner.evaluate(element => getComputedStyle(element).animationPlayState), 'paused', 'shadcn loading animation continued after global pause');
    await page.getByRole('button', { name: '恢复动效', exact: true }).click();
    await page.waitForFunction(() => document.documentElement.dataset.motion === 'standard');
    assert.equal(await scope.getAttribute('data-motion'), 'running', 'shadcn scope did not resume motion');
    await view.getByRole('button', { name: '保存演示草稿', exact: true }).waitFor();
    await setDensity(page, false);
    return { density: await page.locator('html').getAttribute('data-density'), motion: await page.locator('html').getAttribute('data-motion') };
  });
  await test('scoped shadcn styles leave Ant Design components unchanged', async () => {
    await ready(page, 'components');
    await page.locator('.ds-route-components').waitFor();
    const button = page.locator('.ds-route-components .ant-btn-primary').first();
    await button.waitFor();
    await page.mouse.move(1, 1);
    const token = getCohesionTokens({ mode: 'light' });
    await stableColor(button, 'backgroundColor', token.colorPrimary, 'Ant Design primary fill after shadcn');
    await stableColor(button, 'color', token.colorTextLightSolid, 'Ant Design primary foreground after shadcn');
    check(await page.locator('html').getAttribute('data-theme') === 'light', 'global theme drifted');
    await noOverflow(page, 'Ant Design component route');
    return await computed(button);
  });
}

try {
  if (!baseUrl) {
    server = await createPreviewServer();
    await new Promise((resolveListen, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolveListen); });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  }
  report.baseUrl = baseUrl;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'no-preference' });
  await context.addInitScript(() => { if (!localStorage.getItem('zk-theme')) localStorage.setItem('zk-theme', 'light'); });
  const page = await context.newPage();
  monitor(page);
  page.setDefaultTimeout(6000);
  if (only !== 'shadcn') await nestedThemes(page);
  if (only !== 'themes') await shadcnChecks(page);
  await test('browser completed without runtime errors', async () => assert.deepEqual(report.browserErrors, []));
} catch (error) {
  report.checks.push({ name: 'verification setup and navigation', passed: false, error: error.stack || error.message });
  console.error(error.stack || error.message);
} finally {
  await browser?.close();
  if (server) await new Promise(resolveClose => server.close(resolveClose));
  report.finishedAt = new Date().toISOString();
  report.passed = report.checks.every(item => item.passed);
  report.summary = { passed: report.checks.filter(item => item.passed).length, failed: report.checks.filter(item => !item.passed).length };
  const path = resolve(outputDirectory, 'shadcn-theme-validation.json');
  await writeFile(path, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`${report.summary.passed} checks passed; ${report.summary.failed} failed. Report: ${path}`);
  if (!report.passed) process.exitCode = 1;
}
