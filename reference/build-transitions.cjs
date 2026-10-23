const fs = require('fs');
const path = require('path');
process.chdir(path.resolve(__dirname, '..'));

const snippets = JSON.parse(fs.readFileSync('reference/transitions/snippets.json', 'utf8'));
const roots = {
  accordion: ['.t-acc', '.t-acc-head'], 'avatar-group-hover': ['.t-avatar-group'],
  'card-tilt': ['.t-tilt', '.t-tilt-card'], 'error-state-shake': ['.t-input-wrap', '.t-input'],
  'menu-dropdown': ['.t-dropdown'], modal: ['.t-modal'], 'number-pop-in': ['.t-digit-group'],
  'page-side-by-side': ['.t-page-slide'], 'plus-menu-morph': ['.t-morph', '.t-morph-plus'],
  'skeleton-reveal': ['.t-skel', '.t-skel-skeleton'], 'success-check': ['.t-success-check'],
  'tabs-sliding': ['.t-tabs', '.t-tabs-pill', '.t-tab'], 'text-states-swap': ['.t-text-swap'], 'texts-reveal': ['.t-stagger']
};
const actions = {
  'error-state-shake': 'showError', 'menu-dropdown': 'openDropdown, closeDropdown', modal: 'openModal, closeModal',
  'number-pop-in': 'setDigits', 'page-side-by-side': 'showPage', 'plus-menu-morph': 'setOpen',
  'skeleton-reveal': 'reveal, replay', 'success-check': 'showCheck', 'text-states-swap': 'swapText', 'texts-reveal': 'showText, hideText'
};
async function build() {
const { referenceClasses, referenceClassNames, referenceRootClasses, decorateReferenceMarkup } = await import('./transitions/classes.mjs');
const { buildMotionReferenceStyles } = await import('../scripts/build-motion-styles.mjs');
let output = `/* Transition examples adapted from transitions.dev.
 * Explicitly initialize a fragment after its DOM is mounted:
 * const controls = CohesionTransitions.mount("modal", container);
 * controls.openModal(); controls.closeModal(); controls.destroy();
 * Source snippets: reference/transitions/snippets.json. Styles: Tailwind utilities.
 * Regenerate with: node reference/build-transitions.cjs
 */
(function (global) {
  "use strict";
  const mounted = new WeakMap();
  const factories = {\n`;
for (const [slug, snippet] of Object.entries(snippets)) {
  if (!snippet.js) continue;
  let source = snippet.js
    .replace(/document\.querySelectorAll\(/g, 'findAll(')
    .replace(/document\.querySelector\(/g, 'find(')
    .replace(/([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\??\.addEventListener\(/g, 'listen($1, ');
  if (slug === 'input-clear-dissolve') {
    source = source.replace('  const canvas = document.createElement', '  if (!input || !mirror || !phold || !glow || !btn) return;\n  const canvas = document.createElement');
    source = source.replace('  const sync = () => {', '  onCleanup(finish);\n  const sync = () => {');
  }
  if (slug === 'card-tilt') source += '\nonCleanup(reset);';
  if (slug === 'avatar-group-hover') source += '\nonCleanup(() => setShifts(null, "out"));';
  source = source.replace(/\.className\s*=\s*(["'])([\w -]+)\1/g, (_, quote, names) => `.className = ${JSON.stringify(referenceClassNames(names))}`);
  const guards = (roots[slug] || []).map(selector => `!find(${JSON.stringify(selector)})`).join(' || ');
  output += `    ${JSON.stringify(slug)}: function (find, findAll, listen, onCleanup, setTimeout, clearTimeout, requestAnimationFrame, cancelAnimationFrame) {\n`;
  if (guards) output += `      if (${guards}) return {};\n`;
  output += source.split('\n').map(line => '      ' + line).join('\n');
  output += `\n      return { ${actions[slug] || ''} };\n    },\n`;
}
output += `  };
  function mount(slug, scope = document) {
    if (!scope || typeof scope.querySelector !== "function") throw new TypeError("A Document or Element scope is required");
    const owner = scope.nodeType === 9 ? scope : scope.ownerDocument;
    owner.documentElement.classList.add(...rootClasses.split(/\\s+/));
    let bySlug = mounted.get(scope);
    if (!bySlug) { bySlug = new Map(); mounted.set(scope, bySlug); }
    bySlug.get(slug)?.destroy();
    const cleanups = [];
    const decorate = node => {
      if (node.nodeType !== 1 && node.nodeType !== 9) return;
      for (const element of [...(node.nodeType === 1 ? [node] : []), ...node.querySelectorAll('[class]')]) {
        for (const name of [...element.classList]) {
          const utilities = classes[name];
          if (utilities) element.classList.add(...utilities.split(/\\s+/));
        }
      }
    };
    decorate(scope);
    const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(decorate)));
    observer.observe(scope, { childList: true, subtree: true });
    cleanups.push(() => observer.disconnect());
    const timers = new Set();
    const frames = new Set();
    const find = selector => scope.matches?.(selector) ? scope : scope.querySelector(selector);
    const findAll = selector => [...(scope.matches?.(selector) ? [scope] : []), ...scope.querySelectorAll(selector)];
    const listen = (el, type, callback, options) => {
      if (!el) return;
      el.addEventListener(type, callback, options);
      cleanups.push(() => el.removeEventListener(type, callback, options));
    };
    const later = (callback, delay) => {
      const id = global.setTimeout(() => { timers.delete(id); callback(); }, delay);
      timers.add(id);
      return id;
    };
    const clear = id => { global.clearTimeout(id); timers.delete(id); };
    const nextFrame = callback => {
      const id = global.requestAnimationFrame(time => { frames.delete(id); callback(time); });
      frames.add(id);
      return id;
    };
    const cancelFrame = id => { global.cancelAnimationFrame(id); frames.delete(id); };
    let disposed = false;
    const factory = factories[slug];
    const actions = factory ? factory(find, findAll, listen, cleanup => cleanups.push(cleanup), later, clear, nextFrame, cancelFrame) : {};
    const controller = { ...actions, destroy() {
      if (disposed) return;
      disposed = true;
      cleanups.reverse().forEach(cleanup => cleanup());
      timers.forEach(id => global.clearTimeout(id));
      frames.forEach(id => global.cancelAnimationFrame(id));
      timers.clear(); frames.clear();
      bySlug.delete(slug);
    } };
    bySlug.set(slug, controller);
    return controller;
  }
  const classNames = names => names.split(/\\s+/).flatMap(name => [name, classes[name] || ""]).filter(Boolean).join(" ");
  const classes = ${JSON.stringify(referenceClasses)};
  const rootClasses = ${JSON.stringify(referenceRootClasses)};
  global.CohesionTransitions = Object.freeze({ mount, classNames });
})(window);
`;
const css = await buildMotionReferenceStyles(process.cwd());
const publicSnippets = JSON.stringify(Object.fromEntries(Object.entries(snippets).map(([slug, snippet]) => [slug, { ...snippet, html: decorateReferenceMarkup(snippet.html), rootClassName: referenceRootClasses, styleSource: 'reference/transitions/classes.mjs', stylesheet: '/vendor/motion-reference.css' }])), null, 2) + '\n';
const outputs = { 'vendor/transitions.js': output, 'dist/js/transitions.js': output, 'vendor/transitions-snippets.json': publicSnippets, 'vendor/motion-reference.css': css, 'vendor/transitions.css': css, 'dist/css/transitions.css': css };
for (const [name, expected] of Object.entries(outputs)) {
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(name) || fs.readFileSync(name, 'utf8') !== expected) throw new Error(`${name} is stale. Run node reference/build-transitions.cjs.`);
  } else { fs.mkdirSync(path.dirname(name), {recursive: true}); fs.writeFileSync(name, expected); }
}
console.log(`Tailwind Motion references ${process.argv.includes('--check') ? 'current' : 'generated'} (27 snippets).`);
}
build().catch(error => { console.error(error); process.exitCode = 1; });


