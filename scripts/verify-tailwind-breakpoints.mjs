import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createPreviewServer } from './serve.mjs';
import { inclusiveBreakpoints } from '../theme/tailwind-breakpoints.mjs';

const server = await createPreviewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
const report = { checks: [], browserErrors: [], captures: [], appSha256: createHash('sha256').update(await readFile('preview/app.js')).digest('hex'), scope: 'Targeted confirmation of the known media precedence regression. No broad new screenshot/defect round.', breakpoints: inclusiveBreakpoints };
try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width: 375, height: 1800 } });
    await context.addInitScript(theme => localStorage.setItem('zk-theme', theme), theme);
    const page = await context.newPage();
    page.on('pageerror', error => report.browserErrors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/#shadcn?tab=transitions&item=image-open-tilt`);
    await page.locator('[data-transitions-gallery]').waitFor();
    for (const width of [360, 375, 440, 480, 500, 501, 700, 767, 768, 900, 901, 1023, 1024, 1199, 1200, 1250, 1251, 1440]) {
      await page.setViewportSize({ width, height: 1800 });
      const actual = await page.evaluate(() => {
        const root = document.querySelector('[data-shadcn-host]').shadowRoot;
        const columns = selector => getComputedStyle(root.querySelector(selector)).gridTemplateColumns.split(' ').filter(Boolean).length;
        const list = root.querySelector('.sc-tabs-list');
        return { workbench: columns('.sc-tr-workbench'), filters: columns('.sc-tr-filters'), tabsHeight: list.getBoundingClientRect().height, padding: parseFloat(getComputedStyle(document.querySelector('#main-content')).paddingLeft), overflow: document.documentElement.scrollWidth > innerWidth };
      });
      const expected = { workbench: width <= 900 ? 1 : 2, filters: width <= 900 && width > 500 ? 2 : 1, tabsHeight: width <= 767 ? 72 : 36, padding: width <= 360 ? 16 : width <= 767 ? 20 : width <= 1250 ? 32 : 48, overflow: false };
      for (const [property, value] of Object.entries(expected)) report.checks.push({ theme, width, property, expected: value, actual: actual[property], passed: actual[property] === value });
      if (width === 375) {
        const path = `.impeccable/review/tailwind-final-gallery-${theme}-mobile.png`;
        await page.screenshot({ path });
        report.captures.push(path);
      }
    }
    await context.close();
  }
  report.summary = { passed: report.checks.filter(check => check.passed).length, failed: report.checks.filter(check => !check.passed).length };
  await writeFile('.impeccable/review/tailwind-breakpoint-validation.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report.summary, browserErrors: report.browserErrors, failures: report.checks.filter(check => !check.passed) }));
  if (report.summary.failed || report.browserErrors.length) process.exitCode = 1;
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
