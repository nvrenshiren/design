import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { buildBorderBeamStyles } from './build-motion-styles.mjs';

export async function buildBorderBeam(root, { check = false } = {}) {
  const styles = await buildBorderBeamStyles(root);
  const result = await build({
    absWorkingDir: root, entryPoints: ['reference/border-beam/index.ts'], bundle: true,
    format: 'iife', globalName: 'borderBeam', platform: 'browser', target: ['es2020'],
    minify: true, charset: 'utf8', write: false, legalComments: 'eof',
    plugins: [{
      name: 'border-beam-runtime', setup(builder) {
        builder.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'beam-runtime' }));
        builder.onResolve({ filter: /^cohesion-border-beam-styles$/ }, () => ({ path: 'styles', namespace: 'beam-runtime' }));
        builder.onLoad({ filter: /.*/, namespace: 'beam-runtime' }, ({ path }) => ({ contents: path === 'react' ? 'module.exports = window.React;' : `export default ${JSON.stringify(styles)};`, loader: 'js' }));
      },
    }],
    banner: { js: '/* Generated from reference/border-beam by scripts/build-border-beam.mjs; styles compiled by Tailwind. */' },
  });
  const output = result.outputFiles[0].text + '\n';
  for (const path of ['vendor/border-beam.js', 'dist/js/border-beam.js']) {
    const target = resolve(root, path);
    if (check) { if (await readFile(target, 'utf8').catch(() => '') !== output) throw new Error(`${path} is stale. Run node scripts/build-border-beam.mjs.`); }
    else await writeFile(target, output);
  }
  return { bytes: Buffer.byteLength(output), stylesBytes: Buffer.byteLength(styles) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  buildBorderBeam(root, { check: process.argv.includes('--check') }).then(result => console.log(`BorderBeam Tailwind bundle ${process.argv.includes('--check') ? 'current' : 'built'} (${(result.bytes / 1024).toFixed(1)} kB).`)).catch(error => { console.error(error); process.exitCode = 1; });
}
