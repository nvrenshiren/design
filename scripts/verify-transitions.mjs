import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';
import { chromium } from 'playwright';
import { createPreviewServer } from './serve.mjs';

// Test the served, compiled UI. Catalog metadata selects fixtures; assertions
// verify visible results, native accessibility states, focus and interruption.
// No screenshots or visual detector are run by this script.
const root = fileURLToPath(new URL('../', import.meta.url));
const { code } = await transform(await readFile(resolve(root, 'preview/shadcn/transitions/catalog.ts'), 'utf8'), { loader: 'ts', format: 'esm' });
const { TRANSITIONS } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
assert.equal(TRANSITIONS.length, 43);
const report = { startedAt: new Date().toISOString(), checks: [], browserErrors: [], coverage: { themes: ['light', 'dark'], widths: [320, 375], items: TRANSITIONS.map(entry => entry.id) } };
let server, browser, page;
let baseUrl = process.env.COHESION_PREVIEW_URL?.replace(/\/$/, '');
const gallery = () => page.locator('[data-transitions-gallery]');
const stage = () => gallery().locator('[data-transition-demo]');
const toolbarPause = () => gallery().locator('.sc-tr-toolbar button[aria-pressed]');

async function poll(run, message, timeout = 2500) {
  const deadline = Date.now() + timeout;
  let actual;
  while (Date.now() < deadline) {
    actual = await run();
    if (actual) return actual;
    await page.waitForTimeout(25);
  }
  assert.fail(message);
}
async function test(name, run) {
  try {
    const evidence = await run();
    report.checks.push({ name, passed: true, ...(evidence === undefined ? {} : { evidence }) });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({ name, passed: false, error: error.stack || String(error) });
    console.error(`FAIL ${name}: ${error.message}`);
    await page?.keyboard.press('Escape').catch(() => {});
  }
}
async function selectItem(id) {
  await page.keyboard.press('Escape');
  await page.evaluate(value => { location.hash = `shadcn?tab=transitions&item=${value}`; }, id);
  await gallery().locator(`[data-transition-demo="${id}"]`).waitFor();
  await stage().scrollIntoViewIfNeeded();
  return stage();
}
async function localPause(paused) {
  const button = toolbarPause();
  const current = await button.getAttribute('aria-pressed') === 'true';
  if (current !== paused) await button.click();
  await poll(async () => (await button.getAttribute('aria-pressed') === 'true') === paused, 'Local motion preference did not change');
  await stage().scrollIntoViewIfNeeded();
}
async function mode(value) {
  await page.getByRole('button', { name: '选择主题', exact: true }).click();
  await page.getByRole('menuitem').filter({ hasText: value === 'dark' ? '深色主题' : '浅色主题' }).click();
  await page.waitForFunction(expected => document.documentElement.dataset.theme === expected, value);
}
async function focusIs(locator) {
  await poll(() => locator.evaluate(element => element.getRootNode().activeElement === element), 'Focus did not return to its trigger');
}
async function activeMotion(locator = stage()) {
  return locator.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => {
    const duration = animation.effect?.getComputedTiming().duration;
    return animation.playState === 'running' && (duration === Infinity || Number(duration) > 0);
  }).map(animation => ({ type: animation.constructor.name, duration: animation.effect?.getComputedTiming().duration })));
}
async function motionEvidence(locator = stage()) {
  return locator.evaluate(element => element.getAnimations({ subtree: true }).map(animation => ({
    name: animation.animationName || animation.transitionProperty || animation.constructor.name,
    timing: animation.effect?.getTiming(),
    frames: animation.effect?.getKeyframes().map(({ offset, transform, translate, filter, opacity, easing, gridTemplateRows }) => ({ offset, transform, translate, filter, opacity, easing, gridTemplateRows })),
  })));
}
async function noMotion(locator = stage()) {
  await poll(async () => (await activeMotion(locator)).length === 0, 'Animations continue after motion was stopped');
}
async function readable() {
  const result = await stage().evaluate(element => {
    const box = element.getBoundingClientRect();
    const visible = node => {
      const rect = node.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      for (let parent = node; parent && parent !== element.parentElement; parent = parent.parentElement) {
        const css = getComputedStyle(parent);
        if (css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) === 0 || parent.getAttribute('aria-hidden') === 'true') return false;
      }
      return true;
    };
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node, text = '';
    while ((node = walker.nextNode())) if (node.textContent.trim() && visible(node.parentElement)) text += `${node.textContent.trim()} `;
    const namedControls = [...element.querySelectorAll('button[aria-label],input[aria-label],[role="switch"],[role="checkbox"]')].filter(visible).length;
    return { width: box.width, height: box.height, text: text.trim().slice(0, 240), namedControls, iframeCount: element.querySelectorAll('iframe').length };
  });
  assert.ok(result.width > 40 && result.height > 40, 'Demo has no usable visible area');
  assert.ok(result.text.length || result.namedControls, 'Demo has no visible text or named control');
  assert.equal(result.iframeCount, 0, 'Demos must be native React components');
  return result;
}
async function closedOverlays() {
  // Replay is handled by a React effect; let Radix mount and install its
  // dismissal listeners before sending the next user key.
  await page.waitForTimeout(60);
  await page.keyboard.press('Escape');
  await poll(async () => await page.locator('[data-slot="dialog-content"],[data-slot="dropdown-menu-content"]').filter({ visible: true }).count() === 0, 'An overlay still blocks the stage');
}
async function imageReady(locator) {
  await locator.waitFor({ state: 'visible' });
  await poll(() => locator.evaluate(image => image.complete && image.naturalWidth > 0), 'Example image did not load');
  await poll(() => locator.evaluate(image => Number(getComputedStyle(image).opacity) === 1), 'Loaded image did not become fully visible');
}
async function overflowEvidence() {
  return stage().evaluate(element => {
    const width = document.documentElement.clientWidth;
    const rect = element.getBoundingClientRect();
    const offenders = [...element.querySelectorAll('*')].map(node => ({ node, box: node.getBoundingClientRect() })).filter(({ node, box }) => {
      const css = getComputedStyle(node);
      return box.width > 1 && box.height > 1 && css.visibility !== 'hidden' && css.display !== 'none' && (box.right > width + 1 || box.left < -1);
    }).slice(0, 5).map(({ node, box }) => ({ tag: node.tagName, class: node.className?.baseVal ?? node.className, left: box.left, right: box.right }));
    return { viewport: width, document: document.documentElement.scrollWidth, stage: { left: rect.left, right: rect.right, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }, offenders };
  });
}

try {
  if (!baseUrl) {
    server = await createPreviewServer();
    await new Promise((accept, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', accept); });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  }
  report.baseUrl = baseUrl;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'no-preference' });
  await context.addInitScript(() => { localStorage.setItem('zk-theme', 'light'); localStorage.setItem('zk-density', 'comfortable'); });
  page = await context.newPage();
  page.setDefaultTimeout(6500);
  page.on('pageerror', error => report.browserErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.browserErrors.push(message.text()); });
  await page.goto(`${baseUrl}/#shadcn?tab=transitions&item=card-resize`);
  await gallery().waitFor();

  await test('Transitions is a fourth shadcn tab with all 43 entries and usable filters', async () => {
    assert.equal(await page.getByRole('tab', { name: 'Transitions 动效', exact: true }).count(), 1);
    assert.equal(await gallery().locator('.sc-tr-index-item').count(), 43);
    const search = gallery().getByLabel('查找组件', { exact: true });
    await search.fill('Matrix');
    assert.equal(await gallery().locator('.sc-tr-index-item').count(), 1);
    await gallery().getByRole('button', { name: /矩阵加载/ }).click();
    assert.equal(await stage().getAttribute('data-transition-demo'), 'matrix-dot-loader');
    await search.fill('不存在的组件名');
    await gallery().getByText('没有匹配的组件', { exact: true }).waitFor();
    await gallery().getByRole('button', { name: '清除筛选', exact: true }).click();
    const category = gallery().getByRole('combobox', { name: '按用途分类', exact: true });
    await category.click();
    await page.getByRole('option', { name: /数字与文本/ }).click();
    assert.equal(await gallery().locator('.sc-tr-index-item').count(), TRANSITIONS.filter(entry => entry.category === 'text').length);
    await category.click();
    await page.getByRole('option', { name: /全部组件/ }).click();
    return { items: 43, search: true, empty: true, category: true };
  });

  for (const theme of report.coverage.themes) {
    await mode(theme);
    for (const entry of TRANSITIONS) await test(`${theme}: ${entry.id} mounts, replays, stops readably and resumes`, async () => {
      await selectItem(entry.id);
      await localPause(false);
      const mounted = await readable();
      await gallery().getByRole('button', { name: '重放交互', exact: true }).click();
      await closedOverlays();
      await localPause(true);
      await noMotion();
      const paused = await readable();
      await localPause(false);
      return { mounted: mounted.text || `${mounted.namedControls} named control(s)`, paused: paused.text || `${paused.namedControls} named control(s)` };
    });

    await test(`${theme}: Card dimensions interpolate for 300ms and stop instantly`, async () => {
      await selectItem('card-resize'); await localPause(false);
      const card = stage().locator('.sc-tr-layout-resize-card');
      const start = (await card.boundingBox()).width;
      const duration = await card.evaluate(element => getComputedStyle(element).transitionDuration);
      assert.equal(duration, '0.3s');
      await stage().getByRole('button', { name: '展开详情', exact: true }).click();
      await page.waitForTimeout(90);
      const middle = (await card.boundingBox()).width;
      await page.waitForTimeout(310);
      const end = (await card.boundingBox()).width;
      assert.ok(end > start + 40 && middle > start && middle < end, `No actual size interpolation: ${start}, ${middle}, ${end}`);
      await localPause(true);
      await stage().getByRole('button', { name: '收起详情', exact: true }).click();
      const stopped = (await card.boundingBox()).width;
      assert.ok(Math.abs(stopped - start) < 1, `Stopped layout did not settle immediately: ${stopped}`);
      assert.equal(await card.evaluate(element => getComputedStyle(element).transitionDuration), '0s');
      return { start, middle, end, stopped, duration };
    });

    await test(`${theme}: validation exposes an error, retains focus and accepts a corrected value`, async () => {
      await selectItem('error-state-shake'); await localPause(true);
      const input = stage().getByLabel('工作空间名称', { exact: true });
      await stage().getByRole('button', { name: '验证名称', exact: true }).click();
      assert.equal(await input.getAttribute('aria-invalid'), 'true');
      await stage().getByText('名称至少需要 2 个字符，请补充后重试。', { exact: true }).waitFor();
      await focusIs(input);
      await input.fill('逐科');
      await stage().getByRole('button', { name: '验证名称', exact: true }).click();
      assert.equal(await input.getAttribute('aria-invalid'), 'false');
      await stage().getByText('名称已通过验证。', { exact: true }).waitFor();
    });
    await test(`${theme}: dissolve clears the real input and keeps keyboard focus`, async () => {
      await selectItem('input-clear-with-dissolve'); await localPause(false);
      const input = stage().getByLabel('搜索动效', { exact: true });
      assert.ok((await input.inputValue()).length > 0);
      await stage().getByRole('button', { name: '清空搜索内容', exact: true }).click();
      assert.equal(await input.inputValue(), '');
      await focusIs(input);
      await localPause(true); await noMotion();
      await stage().getByRole('button', { name: '恢复示例文字', exact: true }).click();
      assert.ok((await input.inputValue()).length > 0);
    });
    for (const [id, role, name, description] of [
      ['checkbox-check', 'checkbox', '通知我', '已开启项目更新通知'],
      ['toggle', 'switch', '自动同步', '更改会自动同步到工作空间'],
    ]) await test(`${theme}: ${id} has native keyboard and readable on/off states`, async () => {
      await selectItem(id); await localPause(true);
      const control = stage().getByRole(role, { name, exact: true });
      assert.equal(await control.getAttribute('aria-checked'), 'false');
      await control.focus(); await page.keyboard.press('Space');
      assert.equal(await control.getAttribute('aria-checked'), 'true');
      await stage().getByText(description, { exact: true }).waitFor();
      await page.keyboard.press('Space');
      assert.equal(await control.getAttribute('aria-checked'), 'false');
    });
    for (const paused of [false, true]) for (const [id, name] of [['menu-dropdown', '项目操作'], ['dropdown-menu-morph', '打开资源操作菜单']]) {
      await test(`${theme}: ${id} keyboard selection, Escape and focus ${paused ? 'without' : 'with'} motion`, async () => {
        await selectItem(id); await localPause(paused);
        const trigger = stage().getByRole('button', { name, exact: true });
        await trigger.focus(); await page.keyboard.press('ArrowDown');
        await page.getByRole('menu').waitFor();
        await focusIs(page.getByRole('menuitem', { name: '复制链接', exact: true }));
        await page.keyboard.press('ArrowDown');
        await focusIs(page.getByRole('menuitem', { name: '下载文件', exact: true }));
        await page.keyboard.press('Enter');
        await stage().getByText('已选择：下载文件', { exact: true }).waitFor();
        await focusIs(trigger);
        await page.keyboard.press('ArrowDown');
        await page.getByRole('menu').waitFor();
        await poll(() => page.getByRole('menu').evaluate(element => {
          const active = element.getRootNode().activeElement;
          return element.contains(active) && active.getAttribute('role') === 'menuitem';
        }), 'Reopened menu did not focus an actionable item');
        await page.keyboard.press('Escape');
        await page.getByRole('menu').waitFor({ state: 'detached' });
        await focusIs(trigger);
      });
    }
    for (const paused of [false, true]) await test(`${theme}: Dialog closes with Escape and restores focus ${paused ? 'without' : 'with'} motion`, async () => {
      await selectItem('modal-open-close'); await localPause(paused);
      const trigger = stage().getByRole('button', { name: '打开对话框', exact: true });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: '保存当前版本', exact: true });
      await dialog.waitFor();
      await poll(() => dialog.evaluate(element => Number(getComputedStyle(element).opacity) === 1), 'Dialog never became readable');
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'detached' }); await focusIs(trigger);
      assert.equal(await page.locator('body').evaluate(element => getComputedStyle(element).pointerEvents), 'auto');
    });
    await test(`${theme}: Escape during Dialog entrance completes its exit and restores focus`, async () => {
      await selectItem('modal-open-close'); await localPause(false);
      const trigger = stage().getByRole('button', { name: '打开对话框', exact: true });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: '保存当前版本', exact: true });
      await dialog.waitFor();
      const entrance = await motionEvidence(dialog);
      assert.ok(entrance.some(motion => motion.name === 'sc-tr-layout-modal-in' && motion.timing.duration === 250), 'Dialog entrance differs from the observed 250ms reference');
      await page.keyboard.press('Escape');
      const exit = await motionEvidence(dialog);
      assert.ok(exit.some(motion => motion.name === 'sc-tr-layout-modal-out' && motion.timing.duration === 150), 'Dialog exit differs from the observed 150ms reference');
      await dialog.waitFor({ state: 'detached' }); await focusIs(trigger);
      assert.equal(await page.locator('body').evaluate(element => getComputedStyle(element).pointerEvents), 'auto');
      return { entrance, exit };
    });
    await test(`${theme}: panel reveals vertically from half its height with separate entrance and exit timing`, async () => {
      await selectItem('panel-reveal'); await localPause(false);
      const panel = stage().locator('.sc-tr-layout-panel-motion');
      const closed = await panel.evaluate(element => { const css = getComputedStyle(element); return { height: element.getBoundingClientRect().height, y: new DOMMatrixReadOnly(css.transform).m42, filter: css.filter, duration: css.transitionDuration }; });
      assert.ok(closed.height > 60 && Math.abs(closed.y - closed.height / 2) < 1);
      assert.equal(closed.filter, 'blur(2px)');
      await stage().getByRole('button', { name: '展开活动面板', exact: true }).click();
      assert.equal(await panel.evaluate(element => getComputedStyle(element).transitionDuration), '0.4s');
      const entrance = await motionEvidence(panel);
      assert.ok(entrance.some(motion => motion.name === 'transform' && motion.timing.duration === 400), 'Radix measuring suppressed the actual panel transition');
      await stage().getByRole('button', { name: '收起活动面板', exact: true }).click();
      const exitDuration = await panel.evaluate(element => getComputedStyle(element).transitionDuration);
      assert.ok(exitDuration.split(',').every(value => value.trim() === '0.35s'));
      await localPause(true); await noMotion();
      assert.equal(await stage().locator('.sc-tr-layout-panel-content').getAttribute('aria-hidden'), 'true');
      return { closed, entrance, exitDuration };
    });
    await test(`${theme}: Accordion interpolates actual grid rows through Radix measurement`, async () => {
      await selectItem('accordion'); await localPause(false);
      const grid = stage().locator('.sc-tr-layout-accordion-grid');
      assert.equal(await grid.evaluate(element => element.getBoundingClientRect().height), 0);
      const trigger = stage().getByRole('button', { name: '外观与通知', exact: true });
      await trigger.click();
      const motions = await motionEvidence(grid);
      assert.ok(motions.some(motion => motion.name === 'grid-template-rows' && motion.timing.duration === 250), 'Accordion jumps directly to full height');
      const chevron = trigger.locator(':scope > svg');
      await poll(() => chevron.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m22 < -.99), 'Opened Accordion chevron did not point upward');
      assert.equal(await chevron.evaluate(element => getComputedStyle(element).rotate), '0deg', 'Native rotate and the local vertical flip cancel each other');
      await trigger.click();
      await localPause(true); await noMotion();
      assert.equal(await grid.evaluate(element => element.getBoundingClientRect().height), 0);
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      return motions;
    });
    await test(`${theme}: page handoff moves focus into the active page and supports immediate reversal`, async () => {
      await selectItem('page-side-by-side'); await localPause(false);
      const incoming = stage().locator('.sc-tr-layout-page-second');
      const initial = await incoming.evaluate(element => { const css = getComputedStyle(element); return { x: new DOMMatrixReadOnly(css.transform).m41, filter: css.filter, duration: css.transitionDuration }; });
      assert.equal(initial.x, 8); assert.equal(initial.filter, 'blur(3px)');
      assert.ok(initial.duration.split(',').every(value => value.trim() === '0.25s'));
      const asset = stage().locator('button').filter({ hasText: 'Ethereum' });
      await asset.click();
      const back = stage().locator('button[aria-label="返回选择资产"]');
      await focusIs(back);
      assert.equal(await asset.evaluate(element => !!element.closest('[inert]')), true);
      const forward = await motionEvidence();
      await back.click();
      await focusIs(asset);
      assert.equal(await back.evaluate(element => !!element.closest('[inert]')), true);
      await stage().getByRole('button').filter({ hasText: 'Avalanche' }).click();
      await focusIs(back);
      await localPause(true); await noMotion();
      assert.equal(await stage().getByLabel('演示金额', { exact: true }).isVisible(), true);
      return { initial, forward };
    });
    await test(`${theme}: Tooltip supports keyboard focus and Escape`, async () => {
      await selectItem('tooltip-open-close'); await localPause(true);
      const trigger = stage().getByRole('button', { name: '复制', exact: true });
      await trigger.focus();
      await page.getByRole('tooltip').filter({ hasText: '复制链接' }).waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('tooltip').waitFor({ state: 'detached' });
      await focusIs(trigger);
    });
    await test(`${theme}: adjacent tooltip retains a 160ms travelling handoff`, async () => {
      await selectItem('tooltip-open-close'); await localPause(false);
      await stage().getByRole('button', { name: '复制', exact: true }).hover();
      await page.getByRole('tooltip').filter({ hasText: '复制链接' }).waitFor();
      await stage().getByRole('button', { name: '分享', exact: true }).hover();
      await page.getByRole('tooltip').filter({ hasText: '分享给团队' }).waitFor();
      const tip = page.locator('.sc-tr-layout-tooltip[data-travelling="true"]').filter({ visible: true }).last();
      const timing = await tip.evaluate(element => ({ duration: getComputedStyle(element).animationDuration, name: getComputedStyle(element).animationName }));
      assert.equal(timing.duration, '0.16s'); assert.equal(timing.name, 'sc-tr-layout-tooltip-travel');
      await page.keyboard.press('Escape');
      await poll(async () => await page.getByRole('tooltip').count() === 0, 'Closed tooltips retained their accessibility nodes');
      return timing;
    });
    await test(`${theme}: Toast inherits theme, supports undo and is removed on demo switch`, async () => {
      await selectItem('toast-open-close'); await localPause(true);
      await stage().getByRole('button', { name: '显示通知', exact: true }).click();
      const toast = stage().locator('[data-sonner-toast]');
      await toast.getByText('变更已保存', { exact: true }).waitFor();
      assert.equal(await stage().locator('[data-sonner-toaster]').getAttribute('data-sonner-theme'), theme);
      const colors = await toast.evaluate(element => {
        const probe = document.createElement('span'); probe.style.color = 'var(--popover-foreground)'; probe.style.backgroundColor = 'var(--popover)'; element.append(probe);
        const expected = getComputedStyle(probe), css = getComputedStyle(element);
        const result = { actualBackground: css.backgroundColor, expectedBackground: expected.backgroundColor, actualColor: css.color, expectedColor: expected.color };
        probe.remove(); return result;
      });
      assert.equal(colors.actualBackground, colors.expectedBackground); assert.equal(colors.actualColor, colors.expectedColor);
      await toast.getByRole('button', { name: '撤销', exact: true }).click();
      await stage().getByText('已撤销本次保存。', { exact: true }).waitFor();
      await stage().getByRole('button', { name: '显示通知', exact: true }).click();
      await toast.waitFor(); await selectItem('card-resize');
      assert.equal(await page.locator('[data-sonner-toast]').count(), 0);
      return colors;
    });
    await test(`${theme}: banners retain at most three items and close the current item`, async () => {
      await selectItem('banner-stacking'); await localPause(true);
      for (let index = 0; index < 4; index++) await stage().getByRole('button', { name: '添加横幅', exact: true }).click();
      assert.equal(await stage().locator('.sc-tr-layout-banner').count(), 3);
      assert.equal(await stage().getByRole('button', { name: '关闭当前横幅', exact: true }).count(), 1);
      await stage().getByRole('button', { name: '关闭当前横幅', exact: true }).click();
      assert.equal(await stage().locator('.sc-tr-layout-banner').count(), 2);
    });
    await test(`${theme}: image placement has keyboard and button alternatives with loaded results`, async () => {
      await selectItem('drag-drop-with-physics'); await localPause(true);
      const imageButton = stage().getByRole('button', { name: '将示例图片放入目标区域', exact: true });
      await imageButton.focus(); await page.keyboard.press('Enter');
      await stage().getByText('图片已放入，可重置后再次拖拽', { exact: true }).waitFor();
      await imageReady(stage().getByRole('img', { name: '已放入的品牌几何图形', exact: true }));
      await stage().getByRole('button', { name: '重置演示', exact: true }).click();
      await stage().getByRole('button', { name: '放入示例图片', exact: true }).click();
      await imageReady(stage().getByRole('img', { name: '已放入的品牌几何图形', exact: true }));
    });
    await test(`${theme}: image Dialog returns focus and a removed image can be restored`, async () => {
      await selectItem('image-open-tilt'); await localPause(true);
      const trigger = stage().getByRole('button', { name: '放大查看品牌图形', exact: true });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: '品牌几何图形', exact: true });
      await dialog.waitFor(); await imageReady(dialog.locator('img'));
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' }); await focusIs(trigger);
      await selectItem('delete-with-smoky-dissolve');
      await stage().getByRole('button', { name: '移除示例图片', exact: true }).click();
      await stage().getByText('示例图片已移除', { exact: true }).waitFor();
      assert.equal(await stage().locator('img').count(), 0);
      await stage().getByRole('button', { name: '还原示例图片', exact: true }).click();
      await imageReady(stage().getByRole('img', { name: '可移除的示例品牌图形', exact: true }));
    });
    await test(`${theme}: numeric updates show the final digits and expose the same values`, async () => {
      await selectItem('number-pop-in'); await localPause(true);
      await stage().getByRole('button', { name: '更新数值', exact: true }).click();
      assert.equal(await stage().locator('.sc-tr-feedback-digit-row').textContent(), '76.92');
      await selectItem('spinning-counter');
      await stage().getByRole('button', { name: '增加计数', exact: true }).click();
      const counter = stage().getByRole('status', { name: '计数 285', exact: true });
      await counter.waitFor();
      const visibleDigits = await counter.locator('.sc-tr-feedback-reel-window').evaluateAll(windows => windows.map(window => {
        const bounds = window.getBoundingClientRect(), middle = (bounds.top + bounds.bottom) / 2;
        return [...window.querySelectorAll('.sc-tr-feedback-reel > span')].find(digit => { const box = digit.getBoundingClientRect(); return box.top <= middle && box.bottom > middle; })?.textContent;
      }).join(''));
      assert.equal(visibleDigits, '285'); return { popIn: '76.92', counter: visibleDigits };
    });
    await test(`${theme}: rapid numeric updates keep the latest value when interrupted`, async () => {
      await selectItem('number-pop-in'); await localPause(false);
      const update = stage().getByRole('button', { name: '更新数值', exact: true });
      for (let index = 0; index < 3; index++) await update.click();
      await localPause(true); await noMotion();
      assert.equal(await stage().locator('.sc-tr-feedback-digit-row').textContent(), '99.20');
      assert.ok((await stage().locator('[aria-live="polite"]').textContent()).includes('99.20'));
    });
    await test(`${theme}: paused feedback retains completed task, member, text and image results`, async () => {
      for (const [id, text] of [
        ['spinner-to-check-morph', '8 组资源已整理完成'], ['skeleton-loader-and-reveal', '林沐'],
        ['text-states-swap', '处理完成'], ['thinking-states', '方案已准备就绪'],
        ['reasoning-stream', '方案已就绪，可以开始下一步。'],
      ]) { await selectItem(id); await localPause(true); await stage().getByText(text, { exact: true }).first().waitFor(); await noMotion(); }
      await selectItem('streaming-text');
      const streamed = stage().locator('.sc-tr-feedback-stream > p');
      assert.ok((await streamed.textContent()).includes('都清晰可见。'));
      assert.equal(await streamed.locator('span').evaluateAll(nodes => nodes.every(node => Number(getComputedStyle(node).opacity) === 1)), true);
      await selectItem('image-generation-placeholder');
      await stage().getByText('示例图像已生成', { exact: true }).waitFor();
      await imageReady(stage().getByRole('img', { name: '抽象几何图形生成结果，演示图像', exact: true }));
    });
    await test(`${theme}: Like, icon and Pro effect controls report real state changes`, async () => {
      await selectItem('like-button'); await localPause(true);
      await stage().getByRole('button', { name: '喜欢 128', exact: true }).click();
      assert.equal(await stage().getByRole('button', { name: '已喜欢 129', exact: true }).getAttribute('aria-pressed'), 'true');
      await selectItem('icon-swap');
      await stage().getByRole('button', { name: '切换为关闭图标', exact: true }).click();
      assert.equal(await stage().getByRole('button', { name: '切换为菜单图标', exact: true }).getAttribute('aria-pressed'), 'true');
      await selectItem('get-pro-button');
      await stage().getByRole('button', { name: '体验 Pro 按钮', exact: true }).click();
      assert.equal(await stage().getByRole('button', { name: '已体验 Pro 效果', exact: true }).getAttribute('aria-pressed'), 'true');
    });
    await test(`${theme}: Avatar entrance and elastic release retain their separately observed easing`, async () => {
      await selectItem('avatar-group-hover'); await localPause(false);
      const avatar = stage().locator('.sc-tr-effects-avatar-button').first();
      await avatar.hover();
      const entrance = await avatar.evaluate(element => ({ duration: getComputedStyle(element).transitionDuration, easing: getComputedStyle(element).transitionTimingFunction.replace(/\s/g, ''), lift: getComputedStyle(element).getPropertyValue('--avatar-lift') }));
      assert.equal(entrance.duration, '0.32s'); assert.equal(entrance.easing, 'cubic-bezier(0.22,1,0.36,1)'); assert.equal(parseFloat(entrance.lift), -4);
      await gallery().getByRole('button', { name: '重放交互', exact: true }).hover();
      const release = await avatar.evaluate(element => ({ duration: getComputedStyle(element).transitionDuration, easing: getComputedStyle(element).transitionTimingFunction.replace(/\s/g, '') }));
      assert.equal(release.duration, '0.32s'); assert.equal(release.easing, 'cubic-bezier(0.34,3.85,0.64,1)');
      return { entrance, release };
    });
    await test(`${theme}: pointer tilt follows for 400ms and settles back for 1000ms`, async () => {
      await selectItem('3d-tilt'); await localPause(false);
      const card = stage().locator('.sc-tr-effects-tilt-card');
      await card.hover();
      assert.equal(await card.evaluate(element => getComputedStyle(element).transitionDuration), '0.4s');
      await gallery().getByRole('button', { name: '重放交互', exact: true }).hover();
      assert.equal(await card.evaluate(element => getComputedStyle(element).transitionDuration), '1s');
      await localPause(true); await noMotion();
    });
    await test(`${theme}: icon replacement uses 250ms blur and scale without adding rotation`, async () => {
      await selectItem('icon-swap'); await localPause(false);
      const icon = stage().locator('.sc-tr-effects-icon-swap svg').first();
      const timing = await icon.evaluate(element => ({ duration: getComputedStyle(element).transitionDuration, easing: getComputedStyle(element).transitionTimingFunction }));
      assert.ok(timing.duration.split(',').every(value => value.trim() === '0.25s'));
      assert.ok(timing.easing.split(',').every(value => value.trim() === 'ease-in-out'));
      await stage().getByRole('button', { name: '切换为关闭图标', exact: true }).click();
      const matrices = await stage().locator('.sc-tr-effects-icon-swap svg').evaluateAll(nodes => nodes.map(element => { const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform); return { b: matrix.b, c: matrix.c }; }));
      assert.ok(matrices.every(matrix => Math.abs(matrix.b) < .001 && Math.abs(matrix.c) < .001), 'Icon swap introduced a rotation absent from the public reference');
      return { timing, matrices };
    });
    await test(`${theme}: checked feedback draws over 350ms and still settles when interrupted`, async () => {
      await selectItem('checkbox-check'); await localPause(false);
      const checkbox = stage().getByRole('checkbox', { name: '通知我', exact: true });
      await checkbox.click();
      const motions = await motionEvidence(checkbox);
      assert.ok(motions.some(motion => motion.name === 'sc-tr-effects-check-draw' && motion.timing.duration === 350));
      await localPause(true); await noMotion();
      assert.equal(await checkbox.getAttribute('aria-checked'), 'true');
      return motions;
    });
  }

  await test('OS reduced motion interrupts an active loop and shows a stable readable state', async () => {
    await selectItem('matrix-dot-loader'); await localPause(false);
    await gallery().getByRole('button', { name: '重放交互', exact: true }).click();
    await poll(async () => (await activeMotion()).length > 0, 'The loop never started');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await noMotion(); await readable();
    assert.equal(await stage().locator('.sc-tr-feedback-root').getAttribute('data-stopped'), 'true');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await poll(async () => (await stage().locator('.sc-tr-feedback-root').getAttribute('data-stopped')) === 'false', 'Device motion preference did not restore');
  });
  await test('Anime.js drag settling is cancelled immediately when motion is reduced', async () => {
    await selectItem('drag-drop-with-physics'); await localPause(false);
    const card = stage().getByRole('button', { name: '将示例图片放入目标区域', exact: true });
    const bounds = await card.boundingBox();
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width / 2 + 38, bounds.y + bounds.height / 2 + 22, { steps: 5 });
    await page.mouse.up();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await poll(() => card.evaluate(element => { const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform); return Math.abs(matrix.m41) < .1 && Math.abs(matrix.m42) < .1; }), 'Drag settling did not cancel to a stable position');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
  await test('Offscreen loops stop and route unmount cancels their animation handles', async () => {
    await page.setViewportSize({ width: 1440, height: 600 });
    await selectItem('organic-shimmer'); await localPause(false);
    await gallery().getByRole('button', { name: '重放交互', exact: true }).click();
    await poll(async () => (await activeMotion()).length > 0, 'Organic shimmer never started');
    await page.evaluate(() => window.scrollTo(0, 0));
    await poll(async () => await stage().getAttribute('data-motion-stopped') === 'true', 'Offscreen stage did not stop its motion');
    await noMotion();
    await stage().scrollIntoViewIfNeeded();
    await poll(async () => await stage().getAttribute('data-motion-stopped') !== 'true', 'Visible stage did not restore its motion policy');
    await gallery().getByRole('button', { name: '重放交互', exact: true }).click();
    await poll(async () => (await activeMotion()).length > 0, 'The loop did not restart');
    await stage().evaluate(element => { window.__transitionAnimationHandles = element.getAnimations({ subtree: true }); });
    await page.evaluate(() => { location.hash = 'overview'; });
    await page.locator('.ds-route-overview').waitFor();
    assert.equal(await page.locator('[data-transitions-gallery]').count(), 0);
    await poll(() => page.evaluate(() => window.__transitionAnimationHandles.every(animation => ['idle', 'finished'].includes(animation.playState))), 'Unmounted CSS animations are still running');
    await page.waitForTimeout(150);
    await page.evaluate(() => { delete window.__transitionAnimationHandles; });
    await page.evaluate(() => { location.hash = 'shadcn?tab=transitions&item=card-resize'; });
    await gallery().waitFor();
  });

  for (const width of report.coverage.widths) {
    await page.setViewportSize({ width, height: 1000 });
    for (const theme of report.coverage.themes) {
      await mode(theme);
      for (const entry of TRANSITIONS) await test(`${theme} ${width}px: ${entry.id} remains readable without horizontal overflow`, async () => {
        await selectItem(entry.id); await localPause(true); await noMotion(); await readable();
        const evidence = await overflowEvidence();
        assert.ok(evidence.document <= evidence.viewport + 1, `Document overflows: ${JSON.stringify(evidence)}`);
        assert.ok(evidence.stage.left >= -1 && evidence.stage.right <= evidence.viewport + 1, `Stage leaves the viewport: ${JSON.stringify(evidence)}`);
        assert.ok(evidence.stage.scrollWidth <= evidence.stage.clientWidth + 1, `Demo overflows its stage: ${JSON.stringify(evidence)}`);
        return evidence;
      });
      await test(`${theme} ${width}px: native mobile component picker changes the mounted component`, async () => {
        await gallery().getByRole('combobox', { name: '当前组件', exact: true }).click();
        await page.getByRole('option', { name: '消息角标', exact: true }).click();
        assert.equal(await stage().getAttribute('data-transition-demo'), 'notification-badge');
        await readable();
      });
    }
  }
  await test('No browser console errors or uncaught runtime errors', () => assert.deepEqual([...new Set(report.browserErrors)], []));
} catch (error) {
  report.fatal = error.stack || String(error);
  console.error(error);
} finally {
  report.finishedAt = new Date().toISOString();
  report.passed = report.checks.filter(check => check.passed).length;
  report.failed = report.checks.filter(check => !check.passed).length + (report.fatal ? 1 : 0);
  await mkdir(resolve(root, '.impeccable/review'), { recursive: true });
  await writeFile(resolve(root, '.impeccable/review/transitions-validation.json'), JSON.stringify(report, null, 2) + '\n');
  await browser?.close();
  if (server) await new Promise(accept => server.close(accept));
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed, browserErrors: [...new Set(report.browserErrors)] }));
  if (report.failed || report.browserErrors.length) process.exitCode = 1;
}
