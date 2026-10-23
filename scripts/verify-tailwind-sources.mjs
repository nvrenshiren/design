import { access, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const entries = ['preview/tailwind.css', 'preview/foundation.tailwind.css', 'preview/shadcn.css', 'reference/motion-reference.css', 'reference/border-beam/tailwind.css', 'styles/cohesion-base.css'];
const retired = ['preview/styles.css', 'preview/components-showcase.css', 'preview/shadcn-showcase.css', ...['gallery', 'layout', 'feedback', 'effects', 'pro-image', 'pro-smoke', 'pro-confetti'].map(name => `preview/shadcn/transitions/${name}.css`)];
const errors = [];
for (const path of retired) {
  if (await access(new URL(path, root)).then(() => true, () => false)) errors.push(`${path}: retired selector stylesheet must not return`);
}
for (const path of entries) {
  const css = await readFile(new URL(path, root), 'utf8');
  // Tailwind's formal theme, variants, imports and scanning configuration are
  // source configuration; ordinary selector/declaration rules are forbidden.
  const remainder = css.replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/@theme\s+inline\s*\{[^{}]*\}/g, '')
    .replace(/@(?:import|source|plugin|config|layer|custom-variant)\s+[^;]+;/g, '').trim();
  if (remainder) errors.push(`${path}: contains handwritten selector rules instead of Tailwind configuration`);
}
let sourceFiles = 0;
async function inspect(directory) {
  for (const entry of await readdir(new URL(directory, root), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) { await inspect(path); continue; }
    if (!/\.(?:jsx|tsx|ts|mjs)$/.test(path)) continue;
    sourceFiles++;
    const source = await readFile(new URL(path, root), 'utf8');
    if (/@apply\b/.test(source) || /\.(?:ds|sc-tr|bb)-[\w-]+\s*\{/.test(source)) errors.push(`${path}: raw selector or @apply body in component source`);
    for (const match of source.matchAll(/style=\{\{([\s\S]*?)\}\s*(?:as\s+[\w.]+)?\}/g)) {
      const object = match[1].replace(/(['"])--[^'"]+\1\s*:/g, '');
      if (/(?:^|[,\n])\s*(?:['"])?(?:display|color|background(?:Color)?|width|height|minWidth|maxWidth|margin\w*|padding\w*|font\w*|border\w*|position|opacity|transform|transition|animation)(?:['"])?\s*:/.test(object)) errors.push(`${path}: ordinary inline style must be a utility; only measured/token variables belong here`);
    }
  }
}
for (const directory of ['preview/src', 'preview/shadcn', 'reference', 'dist/react']) await inspect(directory);
if (errors.length) throw new Error(errors.join('\n'));
console.log(`Tailwind source policy passed: ${entries.length} directive entries, ${retired.length} retired sheets absent, ${sourceFiles} component/config sources checked. CSS token snapshots, compiled output and third-party internals remain generated assets.`);
