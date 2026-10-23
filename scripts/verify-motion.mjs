import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createPreviewServer } from './serve.mjs';

// Interaction regression for the compiled preview. In particular a paused
// Radix entrance must never freeze at opacity:0, or leave an invisible portal
// blocking the document after Escape. Run after `pnpm build`.
const root = fileURLToPath(new URL('../', import.meta.url));
const report = { startedAt: new Date().toISOString(), checks: [], browserErrors: [] };
let server, browser, activePage;
let baseUrl = process.env.COHESION_PREVIEW_URL?.replace(/\/$/, '');
async function test(name, run) {
  try { const details = await run(); report.checks.push({ name, passed: true, details }); console.log(`PASS ${name}`); }
  catch (error) { report.checks.push({ name, passed: false, error: error.stack || error.message }); console.error(`FAIL ${name}: ${error.message}`); await activePage?.keyboard.press('Escape'); }
}
async function ready(page, route) {
  await page.goto(`${baseUrl}/#${route}`);
  await page.locator(`.ds-route-${route.split('?')[0]}`).waitFor();
  await page.waitForFunction(() => document.documentElement.dataset.motion);
}
async function pause(page, paused) {
  const current = await page.locator('html').getAttribute('data-motion');
  if ((current === 'reduced') !== paused) await page.getByRole('button', { name: paused ? '暂停动效' : '恢复动效', exact: true }).click();
  await page.waitForFunction(expected => document.documentElement.dataset.motion === expected, paused ? 'reduced' : 'standard');
}
async function select(page, name, label) {
  await page.getByRole('combobox', { name, exact: true }).click();
  await page.locator('.ant-select-item-option').filter({ hasText: label }).last().click();
}
async function style(locator) {
  return locator.evaluate(element => { const css = getComputedStyle(element); return { opacity: Number(css.opacity), animationName: css.animationName, animationDuration: css.animationDuration, animationDelay: css.animationDelay, animationPlayState: css.animationPlayState, transform: css.transform, transitionDuration: css.transitionDuration, box: { width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height } }; });
}
async function expectFocus(locator) {
  for (let attempt = 0; attempt < 30; attempt++) {
    if (await locator.evaluate(element => element.getRootNode().activeElement === element)) return;
    await locator.page().waitForTimeout(20);
  }
  assert.fail('Focus did not return to the trigger');
}
async function settledOpacity(locator) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const actual = await style(locator);
    if (actual.opacity === 1) return actual;
    // rc-motion performs its initial class settlement on the next frame even
    // when motion:false. Assert the settled result with a bounded deadline.
    await locator.page().waitForTimeout(20);
  }
  assert.fail('Paused overlay did not settle to opacity:1');
}

const cases = [
  ['accordion', '信息展开'], ['avatar-group-hover', '头像组响应'], ['card-resize', '容器尺寸变化'], ['card-tilt', '卡片跟随'],
  ['checkbox-check', '勾选描画'], ['error-state-shake', '输入错误反馈'], ['icon-swap', '图标状态替换'], ['input-clear-dissolve', '输入清空'],
  ['learn-more-hover', '链接方向反馈'], ['like-button', '收藏确认'], ['menu-dropdown', '菜单展开'], ['modal', '浮层进出'],
  ['notification-badge', '消息角标'], ['number-pop-in', '数字更新'], ['page-side-by-side', '局部页面切换'], ['panel-reveal', '局部面板展开'],
  ['plus-menu-morph', '加号菜单变形'], ['shimmer-text', '状态文字扫光'], ['skeleton-reveal', '骨架到内容'], ['spinning-counter', '滚动数字'],
  ['success-check', '完成确认'], ['tabs-sliding', '滑动选中标记'], ['text-states-swap', '状态文字切换'], ['texts-reveal', '分组文字呈现'],
  ['toast', '通知进出'], ['toggle', '开关状态'], ['tooltip', '提示显隐'],
];

try {
  if (!baseUrl) {
    server = await createPreviewServer();
    await new Promise((accept, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', accept); });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  }
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'no-preference' });
  await context.addInitScript(() => localStorage.setItem('zk-theme', 'light'));
  const page = await context.newPage();
  activePage = page;
  page.setDefaultTimeout(6000);
  page.on('pageerror', error => report.browserErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.browserErrors.push(message.text()); });
  await ready(page, 'shadcn?tab=components');
  const invite = page.getByRole('button', { name: '邀请成员', exact: true });
  const dialog = page.locator('[data-slot="dialog-content"]');
  await test('shadcn native Dialog entrance retains keyframes and duration', async () => {
    await invite.click();
    const actual = await style(dialog);
    assert.equal(actual.animationName, 'enter');
    assert.equal(actual.animationDuration, '0.2s');
    assert.equal(actual.animationPlayState, 'running');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    await expectFocus(invite);
    return actual;
  });
  for (const mode of ['light', 'dark']) {
    await page.getByRole('button', { name: '选择主题', exact: true }).click();
    await page.getByRole('menuitem').filter({ hasText: mode === 'dark' ? '深色主题' : '浅色主题' }).click();
    await page.waitForFunction(expected => document.documentElement.dataset.theme === expected, mode);
    await pause(page, true);
    await test(`${mode}: paused Dialog is visible, validates and returns focus after Escape`, async () => {
      await invite.click();
      const actual = await style(dialog);
      assert.equal(actual.opacity, 1);
      assert.equal(actual.animationDuration, '0s');
      assert.equal(actual.animationDelay, '0s');
      await dialog.getByLabel('成员邮箱', { exact: true }).fill('');
      await dialog.getByRole('button', { name: '发送演示邀请', exact: true }).click();
      await dialog.getByText('请填写完整的成员邮箱', { exact: true }).waitFor();
      await dialog.getByLabel('成员邮箱', { exact: true }).fill('member@example.com');
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'detached' });
      await expectFocus(invite);
      assert.equal(await page.locator('body').evaluate(element => getComputedStyle(element).pointerEvents), 'auto');
      return actual;
    });
    await test(`${mode}: paused AlertDialog and menu retain visible state and dismiss cleanly`, async () => {
      const trigger = page.getByRole('button', { name: '删除演示草稿', exact: true });
      await trigger.click();
      const alert = page.getByRole('alertdialog');
      assert.equal((await style(alert)).opacity, 1);
      await alert.getByRole('button', { name: '保留草稿', exact: true }).click();
      await alert.waitFor({ state: 'detached' });
      await expectFocus(trigger);
      const menuTrigger = page.getByRole('button', { name: '更多空间操作', exact: true });
      await menuTrigger.click();
      const menu = page.getByRole('menu').filter({ has: page.getByRole('menuitem', { name: '复制空间名称', exact: true }) });
      assert.equal((await style(menu)).opacity, 1);
      await page.keyboard.press('Escape');
      await menu.waitFor({ state: 'detached' });
      await expectFocus(menuTrigger);
    });
  }
  await pause(page, false);
  await test('live system reduced motion settles an opening Dialog and resumes native motion', async () => {
    await invite.click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.documentElement.dataset.motion === 'reduced');
    assert.equal((await style(dialog)).opacity, 1);
    assert.equal((await style(dialog)).animationDuration, '0s');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    await expectFocus(invite);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => document.documentElement.dataset.motion === 'standard');
    await invite.click();
    assert.equal((await style(dialog)).animationDuration, '0.2s');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
  });

  await ready(page, 'motion');
  await test('Ant Design native modal and drawer work with paused motion', async () => {
    await pause(page, true);
    const modalTrigger = page.getByRole('button', { name: '体验对话框', exact: false });
    await modalTrigger.click();
    const modal = page.getByRole('dialog', { name: '对话框动效', exact: true });
    await settledOpacity(modal);
    await page.keyboard.press('Escape');
    await modal.waitFor({ state: 'hidden' });
    await expectFocus(modalTrigger);
    const drawerTrigger = page.getByRole('button', { name: '体验抽屉', exact: false });
    await drawerTrigger.click();
    const drawer = page.getByRole('dialog', { name: '抽屉动效', exact: true });
    await drawer.waitFor();
    assert.equal((await style(drawer)).opacity, 1);
    await page.keyboard.press('Escape');
    await drawer.waitFor({ state: 'hidden' });
    await expectFocus(drawerTrigger);
  });
  for (const [slug, label] of cases) {
    await test(`reference ${slug}: replay preserves its visible result with motion paused`, async () => {
      await select(page, '选择组件动效参考', label);
      const iframe = page.locator(`[data-motion-reference="${slug}"] iframe`);
      await iframe.waitFor();
      const frame = await (await iframe.elementHandle()).contentFrame();
      await frame.waitForFunction(() => window.__cohesionMotionDemo && document.documentElement.dataset.motion === 'paused');
      await page.getByRole('button', { name: '重放组件动效', exact: true }).click();
      if (slug === 'texts-reveal') await page.getByRole('button', { name: '重放组件动效', exact: true }).click();
      const result = await frame.evaluate(slug => {
        const find = selector => document.querySelector(selector);
        const opacity = selector => Number(getComputedStyle(find(selector)).opacity);
        let success;
        switch (slug) {
          case 'accordion': success = find('.t-acc-head').getAttribute('aria-expanded') === 'true' && find('.t-acc-panel').getBoundingClientRect().height > 10; break;
          case 'avatar-group-hover': success = getComputedStyle(find('.t-avatar')).transform === 'none'; break;
          case 'card-resize': success = Math.abs(find('.t-resize').getBoundingClientRect().width - find('#specimen').getBoundingClientRect().width) < 1 && find('.t-resize').getBoundingClientRect().height === 160; break;
          case 'card-tilt': success = getComputedStyle(find('.t-tilt-card')).transform === 'none'; break;
          case 'checkbox-check': success = find('.t-check').getAttribute('aria-checked') === 'true' && getComputedStyle(find('.t-check path')).strokeDashoffset === '0px'; break;
          case 'error-state-shake': success = find('input').getAttribute('aria-invalid') === 'true' && opacity('.t-error-msg') === 1; break;
          case 'icon-swap': success = opacity('[data-icon=b]') === 1 && opacity('[data-icon=a]') === 0; break;
          case 'input-clear-dissolve': success = find('input').value === '' && document.activeElement === find('input') && !find('.t-clear').classList.contains('is-clearing'); break;
          case 'learn-more-hover': success = find('.t-learn').textContent.includes('查看项目详情') && document.activeElement === find('.t-learn'); break;
          case 'like-button': success = find('.t-like').getAttribute('aria-pressed') === 'true' && find('.like-label').textContent === '已收藏'; break;
          case 'menu-dropdown': success = opacity('.t-dropdown') === 1; break;
          case 'modal': success = opacity('.t-modal') === 1; break;
          case 'notification-badge': success = opacity('.t-badge-dot') === 1; break;
          case 'number-pop-in': success = find('.t-digit-group').textContent === '19.9' && opacity('.t-digit') === 1; break;
          case 'page-side-by-side': success = find('.t-page-slide').dataset.page === '2' && opacity('[data-page-id="2"]') === 1; break;
          case 'panel-reveal': success = opacity('.t-panel-slide') === 1; break;
          case 'plus-menu-morph': success = find('.t-morph').dataset.open === 'true' && opacity('.t-morph-menu') === 1; break;
          case 'shimmer-text': success = !find('.t-shimmer').classList.contains('is-playing') && find('.t-shimmer').textContent.includes('正在整理'); break;
          case 'skeleton-reveal': success = opacity('.t-skel-content') === 1; break;
          case 'spinning-counter': success = find('.t-reel').getAttribute('aria-label') === '演示计数 260' && new DOMMatrixReadOnly(getComputedStyle(find('.t-reel-strip')).transform).m42 < 0; break;
          case 'success-check': success = opacity('.t-success-check') === 1 && getComputedStyle(find('.t-success-check path')).strokeDashoffset === '0px'; break;
          case 'tabs-sliding': success = [...document.querySelectorAll('.t-tab')][1].getAttribute('aria-selected') === 'true'; break;
          case 'text-states-swap': success = find('.t-text-swap').textContent === '内容已准备好' && opacity('.t-text-swap') === 1; break;
          case 'texts-reveal': success = opacity('.t-stagger-line') === 1; break;
          case 'toast': success = opacity('.t-toast') === 1; break;
          case 'toggle': success = find('.t-toggle').getAttribute('aria-checked') === 'true' && getComputedStyle(find('.t-toggle-thumb')).translate === '14.66px'; break;
          case 'tooltip': success = opacity('.t-tt') === 1; break;
        }
        const running = [...document.querySelectorAll('#specimen *')].flatMap(element => element.getAnimations()).filter(animation => animation.playState === 'running' && Number(animation.effect.getTiming().duration) > 0).length;
        return { success, running, horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1 };
      }, slug);
      assert.equal(result.success, true, `${slug} did not expose the intended result`);
      assert.equal(result.running, 0, `${slug} kept moving while paused`);
      assert.equal(result.horizontalOverflow, false, `${slug} overflowed its reference frame`);
      return result;
    });
  }
  await test('reference native motion resumes and clear animation responds to pause during playback', async () => {
    await select(page, '选择组件动效参考', '输入清空');
    await pause(page, false);
    const iframe = page.locator('[data-motion-reference] iframe');
    const frame = await (await iframe.elementHandle()).contentFrame();
    await frame.waitForFunction(() => window.__cohesionMotionDemo && document.documentElement.dataset.motion === 'running');
    await page.getByRole('button', { name: '重放组件动效', exact: true }).click();
    assert.equal(await frame.locator('.t-clear').evaluate(element => element.classList.contains('is-clearing')), true);
    await pause(page, true);
    // Re-rendering the official theme may reconstruct the isolated frame.
    const pausedFrame = await (await iframe.elementHandle()).contentFrame();
    await pausedFrame.waitForFunction(() => window.__cohesionMotionDemo && document.documentElement.dataset.motion === 'paused');
    await pausedFrame.getByRole('button', { name: '清空搜索', exact: true }).click();
    assert.equal(await pausedFrame.locator('input').inputValue(), '');
    assert.equal(await pausedFrame.locator('.t-clear').evaluate(element => element.classList.contains('is-clearing')), false);
  });
  await test('all nine Orb states and five Beam presets can actually mount', async () => {
    await pause(page, false);
    await page.getByText('品牌实验', { exact: true }).click();
    const orb = page.locator('[data-orb-status]');
    await orb.scrollIntoViewIfNeeded();
    for (const label of ['待命', '工作', '搜索', '求解', '聆听', '连接', '编织', '创作', '塑形']) {
      await select(page, '智能状态动效', label);
      await page.waitForFunction(() => document.querySelector('[data-orb-status]')?.dataset.orbStatus === 'ready');
      assert.equal(await orb.locator('canvas').evaluate(element => element.width > 0 && element.height > 0), true);
    }
    for (const label of ['小型控件 · sm', '容器流光 · md', '底边流光 · line', '外侧呼吸 · pulse-outside', '内侧呼吸 · pulse-inner']) {
      await select(page, '边框光效预设', label);
      await page.locator('[data-beam]').waitFor();
      assert.ok((await style(page.locator('[data-beam]'))).box.width > 20);
    }
    await pause(page, true);
    assert.equal(await page.locator('[data-beam]').count(), 0, 'Brand Beam kept a running renderer while globally paused');
    const canvas = orb.locator('canvas');
    const first = await canvas.evaluate(element => element.toDataURL());
    await page.waitForTimeout(120);
    assert.equal(await canvas.evaluate(element => element.toDataURL()), first, 'Orb kept drawing while globally paused');
  });
  await test('motion reference remains usable at 320px without document overflow', async () => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.locator('[data-motion-reference]').scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <= innerWidth + 1), true);
    await select(page, '选择组件动效参考', '开关状态');
    await page.getByRole('button', { name: '重放组件动效', exact: true }).click();
    await page.frameLocator('[data-motion-reference] iframe').getByRole('switch').waitFor();
    assert.equal(await page.frameLocator('[data-motion-reference] iframe').getByRole('switch').getAttribute('aria-checked'), 'true');
  });
  await test('no browser runtime errors', async () => assert.deepEqual(report.browserErrors, []));
} catch (error) {
  report.checks.push({ name: 'setup or navigation', passed: false, error: error.stack || error.message });
  console.error(error.stack || error.message);
} finally {
  await browser?.close();
  if (server) await new Promise(accept => server.close(accept));
  report.finishedAt = new Date().toISOString();
  report.summary = { passed: report.checks.filter(check => check.passed).length, failed: report.checks.filter(check => !check.passed).length };
  await mkdir(resolve(root, '.impeccable/review'), { recursive: true });
  const output = resolve(root, '.impeccable/review/motion-regression.json');
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`${report.summary.passed} passed, ${report.summary.failed} failed. Report: ${output}`);
  if (report.summary.failed) process.exitCode = 1;
}
