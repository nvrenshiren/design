import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { compile, optimize } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';

// Optional base styles are separate from the documentation shell and Ant Design.
const root = new URL('../', import.meta.url);
const source = new URL('styles/cohesion-base.css', root);
const compiler = await compile(await readFile(source, 'utf8'), {
  base: fileURLToPath(new URL('styles/', root)),
  from: fileURLToPath(source),
  onDependency() {},
});
const scanner = new Scanner({ sources: compiler.sources });
const output = '/* Tailwind output. Source: styles/cohesion-base.classes.mjs. Do not edit directly. */\n' + optimize(compiler.build(scanner.scan()), { minify: true }).code + '\n';
const target = new URL('dist/css/cohesion-base.css', root);
const classSource = await readFile(new URL('styles/cohesion-base.classes.mjs', root), 'utf8');
const classTarget = new URL('dist/css/cohesion-base.classes.mjs', root);
if (process.argv.includes('--check')) {
  const current = await readFile(target, 'utf8');
  if (current !== output) throw new Error('Base stylesheet mirror is stale. Run node scripts/sync-preview.mjs.');
  if (await readFile(classTarget, 'utf8').catch(() => '') !== classSource) throw new Error('Base class module mirror is stale. Run node scripts/sync-preview.mjs.');
  console.log('Base stylesheet mirror is current.');
} else {
  await mkdir(new URL('dist/css/', root), { recursive: true });
  await writeFile(target, output);
  await writeFile(classTarget, classSource);
  console.log(`Updated ${fileURLToPath(target)}`);
}
