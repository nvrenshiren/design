import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createPreviewServer } from './serve.mjs';

// Exercise the served components, including interruption and real CSS geometry.
// Reference-frame captures and subjective material comparison are separate evidence.
const report = { startedAt: new Date().toISOString(), checks: [], browserErrors: [] };
let browser, server, page;
const gallery = () => page.locator('[data-transitions-gallery]');
const stage = () => gallery().locator('[data-transition-demo]');
const pause = () => gallery().locator('.sc-tr-toolbar button[aria-pressed]');
async function poll(run, message, timeout = 3000) {
  const until = Date.now() + timeout;
  while (Date.now() < until) { if (await run()) return; await page.waitForTimeout(20); }
  assert.fail(message);
}
async function test(name, run) {
  try { const evidence = await run(); report.checks.push({ name, passed: true, evidence }); console.log(`PASS ${name}`); }
  catch (error) { report.checks.push({ name, passed: false, error: error.stack || String(error) }); console.error(`FAIL ${name}: ${error.message}`); await page.keyboard.press('Escape').catch(() => {}); }
  finally { await page.emulateMedia({ reducedMotion: 'no-preference' }); }
}
async function select(id) {
  await page.keyboard.press('Escape');
  if (await stage().getAttribute('data-transition-demo').catch(() => null) === id) {
    await page.evaluate(() => { location.hash = 'shadcn?tab=transitions&item=card-resize'; });
    await gallery().locator('[data-transition-demo="card-resize"]').waitFor();
  }
  await page.evaluate(value => { location.hash = `shadcn?tab=transitions&item=${value}`; }, id);
  await gallery().locator(`[data-transition-demo="${id}"]`).waitFor();
  await stage().scrollIntoViewIfNeeded();
  if (await pause().getAttribute('aria-pressed') === 'true') await pause().click();
  await stage().scrollIntoViewIfNeeded();
  await poll(() => stage().evaluate(element => element.firstElementChild?.getAttribute('data-stopped') !== 'true'), 'Demo is not ready for motion');
}
async function mode(value) {
  await page.getByRole('button', { name: '选择主题', exact: true }).click();
  await page.getByRole('menuitem').filter({ hasText: value === 'dark' ? '深色主题' : '浅色主题' }).click();
  await page.waitForFunction(expected => document.documentElement.dataset.theme === expected, value);
}
async function noMotion(locator) {
  await poll(() => locator.evaluate(element => element.getAnimations({ subtree: true }).every(animation => ['idle', 'finished'].includes(animation.playState))), 'Interrupted effect still has running animations');
}
async function restoredFocus(locator) {
  await poll(() => locator.evaluate(element => element.getRootNode().activeElement === element), 'Dialog did not restore focus to its trigger');
}
async function loaded(locator) {
  await poll(() => locator.evaluate(image => image.complete && image.naturalWidth > 0), 'Image is not decoded');
}

try {
  server = await createPreviewServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  report.baseUrl = base;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'no-preference' });
  await context.addInitScript(() => { localStorage.setItem('zk-theme', 'light'); localStorage.setItem('zk-density', 'comfortable'); });
  page = await context.newPage(); page.setDefaultTimeout(5500);
  page.on('pageerror', error => report.browserErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.browserErrors.push(message.text()); });
  await page.goto(`${base}/#shadcn?tab=transitions&item=image-open-tilt`); await gallery().waitFor();
  await test('First global pause keeps the existing page and typed component filter', async () => {
    const originalPage = page;
    const freshContext = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'no-preference' });
    try {
      page = await freshContext.newPage();
      await page.goto(`${base}/#shadcn?tab=transitions&item=image-open-tilt`); await gallery().waitFor();
      await gallery().getByLabel('查找组件', { exact: true }).fill('confetti');
      await page.evaluate(() => { window.__proPageIdentity = document.getElementById('main-content'); });
      await page.getByRole('button', { name: '暂停动效', exact: true }).click();
      await poll(async () => await page.getByRole('button', { name: '恢复动效', exact: true }).getAttribute('aria-pressed') === 'true', 'Global pause was not applied');
      assert.equal(await page.evaluate(() => window.__proPageIdentity === document.getElementById('main-content')), true, 'First motion change remounted the page');
      assert.equal(await gallery().getByLabel('查找组件', { exact: true }).inputValue(), 'confetti');
      await page.getByRole('button', { name: '恢复动效', exact: true }).click();
      assert.equal(await gallery().getByLabel('查找组件', { exact: true }).inputValue(), 'confetti');
    } finally { await freshContext.close(); page = originalPage; }
  });
  for (const theme of ['light', 'dark']) {
    await mode(theme);
    await test(`${theme}: image opens a real focus-managed Dialog and settles to one decoded image`, async () => {
      await select('image-open-tilt');
      const trigger = stage().getByRole('button', { name: '放大查看品牌图形', exact: true });
      await trigger.focus(); await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: '品牌几何图形', exact: true }); await dialog.waitFor();
      await poll(async () => await dialog.getAttribute('data-image-phase') === 'open', 'Image did not finish opening');
      assert.equal(await dialog.locator('img').count(), 1); await loaded(dialog.locator('img'));
      assert.equal(await dialog.locator('.sc-pro-image-slice').count(), 48);
      const appearance = await dialog.locator('img').evaluate(image => ({ opacity: getComputedStyle(image).opacity, width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height }));
      assert.equal(appearance.opacity, '1'); assert.ok(Math.abs(appearance.width / appearance.height - 1.5) < .02);
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' }); await restoredFocus(trigger);
      return appearance;
    });
    await test(`${theme}: image can reverse an active entrance and settle immediately under reduced motion`, async () => {
      await select('image-open-tilt');
      const trigger = stage().getByRole('button', { name: '放大查看品牌图形', exact: true }); await trigger.click();
      const dialog = page.getByRole('dialog', { name: '品牌几何图形', exact: true }); await dialog.waitFor();
      await page.waitForTimeout(90); await page.keyboard.press('Escape');
      await poll(async () => await dialog.getAttribute('data-image-phase') === 'closing', 'Early Escape did not begin the return');
      // Keyboard activation does not wait for a moving image's hit box to settle.
      // A normal Playwright click would wait until this 350ms exit has unmounted it.
      await dialog.getByRole('button', { name: '重新展开图片', exact: true }).focus();
      await page.keyboard.press('Enter');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await poll(async () => await dialog.getAttribute('data-image-phase') === 'open', 'Reduced image did not settle open');
      await noMotion(dialog);
      assert.equal(await dialog.locator('img').evaluate(image => getComputedStyle(image).opacity), '1');
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' }); await restoredFocus(trigger);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      assert.equal(await page.locator('body').evaluate(element => getComputedStyle(element).pointerEvents), 'auto');
    });
    await test(`${theme}: smoke softens and sinks as a continuous image, then removes and restores`, async () => {
      await select('delete-with-smoky-dissolve');
      const image = stage().getByRole('img', { name: '可移除的示例品牌图形', exact: true }); await loaded(image);
      await stage().getByRole('button', { name: '移除示例图片', exact: true }).click();
      const material = stage().locator('.sc-tr-pro-smoke-material'); await material.waitFor();
      const evidence = await material.evaluate(element => {
        const motion = element.getAnimations().find(animation => animation.animationName === 'sc-tr-pro-smoke-material');
        if (!motion) throw new Error('Smoke has no real CSS interpolation');
        motion.pause();
        return [0, 195, 311, 511].map(time => {
          motion.currentTime = time;
          const css = getComputedStyle(element), matrix = new DOMMatrixReadOnly(css.transform);
          return { time, opacity: Number(css.opacity), y: matrix.m42, filter: css.filter };
        });
      });
      assert.ok(evidence[0].opacity > .99 && evidence[1].opacity > .55 && evidence[1].opacity < .8);
      assert.ok(evidence[2].opacity > .25 && evidence[2].opacity < .5 && evidence[3].opacity < .06);
      assert.ok(evidence[3].y > 20 && evidence[3].y < 40);
      await pause().click(); await noMotion(stage());
      await stage().getByText('示例图片已移除', { exact: true }).waitFor();
      await stage().getByRole('button', { name: '还原示例图片', exact: true }).click(); await loaded(image);
      return evidence;
    });
    await test(`${theme}: restoring smoke mid-flight cancels old material and reduced motion preserves the result`, async () => {
      await select('delete-with-smoky-dissolve');
      await stage().getByRole('button', { name: '移除示例图片', exact: true }).click();
      await stage().getByRole('button', { name: '还原示例图片', exact: true }).click();
      await page.waitForTimeout(750);
      await loaded(stage().getByRole('img', { name: '可移除的示例品牌图形', exact: true }));
      assert.equal(await stage().locator('.sc-tr-effects-delete-stage').getAttribute('data-phase'), 'ready');
      await stage().getByRole('button', { name: '移除示例图片', exact: true }).click();
      await page.emulateMedia({ reducedMotion: 'reduce' }); await noMotion(stage());
      await stage().getByText('示例图片已移除', { exact: true }).waitFor();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    });
    await test(`${theme}: confetti spans the stage and lands on real button and floor surfaces`, async () => {
      await select('confetti-burst'); await stage().getByRole('button', { name: '庆祝完成', exact: true }).click();
      const evidence = await stage().locator('.sc-tr-effects-confetti-stage').evaluate(element => {
        const bounds = element.getBoundingClientRect(), button = element.querySelector('button').getBoundingClientRect();
        const papers = [...element.querySelectorAll('.sc-tr-pro-confetti-piece')];
        return { width: bounds.width, height: bounds.height, button: { left: button.left - bounds.left, right: button.right - bounds.left, top: button.top - bounds.top, centerY: button.top + button.height / 2 - bounds.top },
          papers: papers.map(paper => {
            const animation = paper.getAnimations()[0]; animation.pause(); animation.currentTime = 2900;
            const css = getComputedStyle(paper), matrix = new DOMMatrixReadOnly(css.transform);
            return { landing: paper.dataset.landing, x: matrix.m41 + paper.offsetWidth / 2, y: matrix.m42 + paper.offsetHeight / 2, faces: paper.children.length, color: css.color, duration: animation.effect.getTiming().duration };
          }) };
      });
      assert.ok(evidence.papers.length >= 38 && evidence.papers.length <= 88);
      assert.ok(Math.abs(evidence.button.centerY - evidence.height / 2) < 2);
      const buttonPapers = evidence.papers.filter(paper => paper.landing === 'button'), floorPapers = evidence.papers.filter(paper => paper.landing === 'floor');
      assert.ok(buttonPapers.length > 0 && floorPapers.length > 0);
      assert.ok(buttonPapers.every(paper => paper.x >= evidence.button.left - 3 && paper.x <= evidence.button.right + 3 && Math.abs(paper.y - evidence.button.top) < 7));
      assert.ok(floorPapers.every(paper => Math.abs(paper.y - evidence.height) < 7));
      assert.ok(Math.max(...evidence.papers.map(paper => paper.x)) - Math.min(...evidence.papers.map(paper => paper.x)) > evidence.width * .7);
      assert.ok(evidence.papers.every(paper => paper.faces === 2 && paper.duration > 2800 && paper.duration < 4000));
      assert.equal(new Set(evidence.papers.map(paper => paper.color)).size, 3);
      await pause().click(); await noMotion(stage());
      assert.equal(await stage().locator('.sc-tr-pro-confetti-papers').count(), 0);
      return evidence;
    });
    await test(`${theme}: repeated confetti replaces its burst, cleans up and pauses without replaying old particles`, async () => {
      await select('confetti-burst'); const button = stage().getByRole('button', { name: '庆祝完成', exact: true }); await button.click();
      const first = await stage().locator('.sc-tr-pro-confetti-piece').first().evaluate(element => getComputedStyle(element).animationName);
      await gallery().getByRole('button', { name: '重放交互', exact: true }).click();
      const next = await stage().locator('.sc-tr-pro-confetti-piece').first().evaluate(element => getComputedStyle(element).animationName);
      assert.notEqual(first, next); assert.equal(await stage().locator('.sc-tr-pro-confetti-papers').count(), 1);
      await page.emulateMedia({ reducedMotion: 'reduce' }); await noMotion(stage());
      assert.equal(await stage().locator('.sc-tr-pro-confetti-papers').count(), 0);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      assert.equal(await stage().locator('.sc-tr-pro-confetti-papers').count(), 0);
      await button.click(); await poll(async () => await stage().locator('.sc-tr-pro-confetti-papers').count() === 0, 'Finite confetti retained its particle DOM', 4300);
    });
  }
  for (const width of [320, 375]) for (const theme of ['light', 'dark']) {
    await page.setViewportSize({ width, height: 900 }); await mode(theme);
    for (const id of ['image-open-tilt', 'delete-with-smoky-dissolve', 'confetti-burst']) await test(`${theme} ${width}px: ${id} remains within the viewport`, async () => {
      await select(id);
      if (id === 'image-open-tilt') await stage().getByRole('button', { name: '放大查看品牌图形', exact: true }).click();
      else await stage().getByRole('button', { name: id === 'confetti-burst' ? '庆祝完成' : '移除示例图片', exact: true }).click();
      const widthEvidence = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(widthEvidence.scroll <= widthEvidence.client + 1);
      const scene = id === 'image-open-tilt' ? page.getByRole('dialog', { name: '品牌几何图形', exact: true }) : stage();
      const bounds = await scene.boundingBox(); assert.ok(bounds.x >= -1 && bounds.x + bounds.width <= width + 1);
      await page.emulateMedia({ reducedMotion: 'reduce' }); await noMotion(scene);
      if (id === 'image-open-tilt') { await page.keyboard.press('Escape'); await scene.waitFor({ state: 'detached' }); }
      await page.emulateMedia({ reducedMotion: 'no-preference' }); return widthEvidence;
    });
  }
  await test('No browser errors', () => assert.deepEqual([...new Set(report.browserErrors)], []));
} catch (error) { report.fatal = error.stack || String(error); }
finally {
  report.finishedAt = new Date().toISOString(); report.passed = report.checks.filter(check => check.passed).length;
  report.failed = report.checks.filter(check => !check.passed).length + (report.fatal ? 1 : 0);
  await mkdir('.impeccable/review', { recursive: true });
  await writeFile('.impeccable/review/pro-transitions-validation.json', JSON.stringify(report, null, 2) + '\n');
  await browser?.close(); if (server) await new Promise(resolve => server.close(resolve));
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed, browserErrors: report.browserErrors, fatal: report.fatal }));
  if (report.failed || report.browserErrors.length) process.exitCode = 1;
}
