import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildShadcnStyles, buildDocumentStyles } from './build-shadcn-styles.mjs';
import { buildBorderBeam } from './build-border-beam.mjs';
import { radixShadowFocusPlugin } from './radix-shadow-focus.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const entry = resolve(root, 'preview/src/app.jsx');
const output = resolve(root, 'preview/app.js');
const checkOnly = process.argv.includes('--check');

// React is a separate, pinned UMD asset. Never bundle a second React instance.
const reactGlobals = {
  name: 'react-from-window',
  setup(build) {
    build.onResolve({ filter: /^(react|react-dom|react-dom\/client)$/ }, ({ path }) => ({
      path,
      namespace: 'cohesion-react-global',
    }));
    build.onLoad({ filter: /.*/, namespace: 'cohesion-react-global' }, ({ path }) => ({
      contents: `module.exports = window.${path === 'react' ? 'React' : 'ReactDOM'};`,
      loader: 'js',
    }));
  },
};

async function main() {
  const unknown = process.argv.slice(2).filter(argument => argument !== '--check');
  if (unknown.length) throw new Error(`Unknown argument: ${unknown.join(', ')}`);
  try {
    await access(entry);
  } catch {
    throw new Error('Missing preview/src/app.jsx. Add the preview entry before running pnpm build.');
  }

  let build;
  try {
    ({ build } = await import('esbuild'));
  } catch {
    throw new Error('Build dependency is missing. Run pnpm install --frozen-lockfile first.');
  }

  // All owned sheets and motion recipes are built from utility/config sources.
  for (const script of ['scripts/verify-tailwind-sources.mjs', 'scripts/sync-preview.mjs', 'reference/build-transitions.cjs']) {
    const generated = spawnSync(process.execPath, [script, ...(checkOnly ? ['--check'] : [])], {
      cwd: root, stdio: 'inherit', windowsHide: true,
    });
    if (generated.error) throw generated.error;
    if (generated.status !== 0) throw new Error(`${script} ${checkOnly ? '--check ' : ''}failed.`);
  }
  await buildBorderBeam(root, { check: checkOnly });
  const documentStyles = await buildDocumentStyles(root);
  const documentStylesPath = resolve(root, 'preview/tailwind.generated.css');
  if (checkOnly) {
    if (await readFile(documentStylesPath, 'utf8').catch(() => '') !== documentStyles) throw new Error('Document Tailwind sheet is stale. Run pnpm build.');
  } else {
    await writeFile(documentStylesPath, documentStyles);
  }

  const shadcnStyles = await buildShadcnStyles(root);
  const scopedStyles = {
    name: 'shadcn-shadow-styles',
    setup(builder) {
      builder.onResolve({ filter: /^cohesion-shadcn-styles$/ }, () => ({ path: 'styles', namespace: 'cohesion-shadcn' }));
      builder.onLoad({ filter: /.*/, namespace: 'cohesion-shadcn' }, () => ({ contents: `export default ${JSON.stringify(shadcnStyles)};`, loader: 'js' }));
    },
  };

  const result = await build({
    absWorkingDir: root,
    entryPoints: [entry],
    outfile: output,
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    plugins: [reactGlobals, scopedStyles, radixShadowFocusPlugin()],
    charset: 'utf8',
    legalComments: 'eof',
    minify: true,
    sourcemap: false,
    write: false,
    logLevel: 'silent',
    banner: {
      js: '/* Generated from preview/src/app.jsx by scripts/build-preview.mjs. Do not edit directly. */',
    },
  });
  const compiled = result.outputFiles.find(file => file.path === output)?.text;
  if (!compiled) throw new Error('The preview build did not produce JavaScript.');

  if (checkOnly) {
    for (const file of result.outputFiles) {
      let current = '';
      try { current = await readFile(file.path, 'utf8'); } catch { /* Report one actionable error below. */ }
      if (current !== file.text) throw new Error(`${relative(root, file.path)} is missing or stale. Run pnpm build.`);
    }
    for (const script of ['tokens/sync-tokens.mjs', 'scripts/generate-shadcn-tokens.mjs']) {
      const checked = spawnSync(process.execPath, [script, '--check'], {
        cwd: root,
        stdio: 'inherit',
        windowsHide: true,
      });
      if (checked.error) throw checked.error;
      if (checked.status !== 0) throw new Error(`${script} --check failed.`);
    }
    console.log('Preview bundle and generated mirrors are current.');
    return;
  }

  await mkdir(dirname(output), { recursive: true });
  for (const file of result.outputFiles) {
    await writeFile(file.path, file.contents);
    console.log(`Built ${relative(root, file.path).replaceAll('\\', '/')} (${(file.contents.byteLength / 1024).toFixed(1)} kB).`);
  }
}

main().catch(error => {
  if (error.errors) {
    for (const issue of error.errors) {
      const location = issue.location;
      console.error(`${location ? `${location.file}:${location.line}:${location.column}: ` : ''}${issue.text}`);
    }
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
});
