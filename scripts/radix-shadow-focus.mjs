import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

// These pinned upstream helpers read document.activeElement to decide whether
// candidate.focus() succeeded. Inside our open ShadowRoot that value remains
// the host, so focusFirst incorrectly walks every item and ends at the last.
// Keep this compatibility adaptation in the preview build; never change the
// installed package, browser Document prototype, or normal light-DOM behavior.
const sources = {
  '@radix-ui/react-roving-focus': { version: '1.2.1', documentReads: 2, ownerDocumentReads: 0 },
  '@radix-ui/react-menu': { version: '2.2.1', documentReads: 3, ownerDocumentReads: 0 },
  '@radix-ui/react-focus-scope': { version: '1.3.1', documentReads: 6, ownerDocumentReads: 1 },
};

const helperName = 'cohesionDeepActiveElement';
const helper = `
// COHESION preview: resolve the focused node through open shadow boundaries.
function ${helperName}(ownerDocument = document) {
  let activeElement = ownerDocument.activeElement;
  while (activeElement?.shadowRoot?.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
}
`;

export function radixShadowFocusPlugin() {
  const patched = new Set();
  return {
    name: 'radix-shadow-focus',
    setup(build) {
      build.onStart(() => { patched.clear(); });
      build.onLoad({ filter: /[/\\]@radix-ui[/\\]react-(?:roving-focus|menu|focus-scope)[/\\]dist[/\\]index\.mjs$/ }, async ({ path }) => {
        const manifest = JSON.parse(await readFile(resolve(dirname(path), '../package.json'), 'utf8'));
        const contract = sources[manifest.name];
        if (!contract || manifest.version !== contract.version) {
          throw new Error(`Review the Radix shadow focus adaptation for ${manifest.name}@${manifest.version}; expected ${contract?.version || 'a supported package'}.`);
        }
        const source = await readFile(path, 'utf8');
        if (source.includes(helperName)) throw new Error(`${manifest.name} unexpectedly defines ${helperName}.`);
        for (const [expression, expected] of [
          ['document.activeElement', contract.documentReads],
          ['ownerDocument.activeElement', contract.ownerDocumentReads],
        ]) {
          const actual = source.split(expression).length - 1;
          if (actual !== expected) {
            throw new Error(`${manifest.name}@${manifest.version}: expected ${expected} ${expression} reads, received ${actual}. Review the upstream focus code before building.`);
          }
        }
        const contents = source
          .replaceAll('document.activeElement', `${helperName}(document)`)
          .replaceAll('ownerDocument.activeElement', `${helperName}(ownerDocument)`);
        if (/(?:document|ownerDocument)\.activeElement/.test(contents)) {
          throw new Error(`${manifest.name}: an expected focus read escaped the shadow adaptation.`);
        }
        patched.add(manifest.name);
        return { contents: `${helper}\n${contents}`, loader: 'js', resolveDir: dirname(path), watchFiles: [path, resolve(dirname(path), '../package.json')] };
      });
      build.onEnd(result => {
        if (result.errors.length) return;
        const missing = Object.keys(sources).filter(name => !patched.has(name));
        if (missing.length) return { errors: [{ text: `Radix shadow focus adaptation did not load ${missing.join(', ')}. Review dependency resolution before building.` }] };
      });
    },
  };
}
