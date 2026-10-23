import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { theme, version as antdVersion } from 'antd';
import { createCohesionTheme, getCohesionTokens, themeSource, contrastRatio } from '../theme/create-theme.mjs';

const root = new URL('../', import.meta.url);
const checkOnly = process.argv.includes('--check');
const unknown = process.argv.slice(2).filter(argument => argument !== '--check');
if (unknown.length) throw new Error(`Unknown argument: ${unknown.join(', ')}`);
if (antdVersion !== themeSource.foundation.version) throw new Error(`Expected antd ${themeSource.foundation.version}, installed ${antdVersion}. Review the theme before changing foundation.version.`);
const kebab = value => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const variable = key => `--ant-token-${kebab(key)}`;
const ref = key => `var(${variable(key)})`;
const cssValue = (key, value) => typeof value === 'number' ? `${value}${/^(lineHeight|fontWeight|opacity|zIndex|motion)/.test(key) ? '' : 'px'}` : typeof value === 'boolean' ? value ? '1' : '0' : value.replace(/\s+/g, ' ').trim();
const primitive = { '--zk-brand-green': themeSource.brand.logo.green, '--zk-brand-lime': themeSource.brand.logo.lime, '--zk-brand-cyan': themeSource.brand.logo.cyan, '--zk-brand-gray': '#9FA499' };
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
// Legacy palette names are aliases to the official presets, separate from Logo.
for (const color of ['green', 'lime', 'cyan', 'red', 'orange', 'blue']) for (const [index, step] of steps.entries()) primitive[`--zk-${color}-${step}`] = ref(`${color}-${index + 1}`);
const aliasGroup = (prefix, values) => Object.assign(primitive, Object.fromEntries(Object.entries(values).map(([name, key]) => [`--zk-${prefix}-${name}`, ref(key)])));
aliasGroup('neutral', { 0: 'colorWhite', 50: 'colorBgLayout', 100: 'colorBorderSecondary', 200: 'colorBorder', 300: 'colorTextQuaternary', 400: 'colorTextTertiary', 500: 'colorTextSecondary', 600: 'colorTextSecondary', 700: 'colorText', 800: 'colorText', 900: 'colorTextBase' });
aliasGroup('space', { 1: 'sizeXXS', 2: 'sizeXS', 3: 'sizeSM', 4: 'size', 5: 'sizeMD', 6: 'sizeLG', 8: 'sizeXL', 12: 'sizeXXL' });
aliasGroup('text', { xs: 'fontSizeSM', sm: 'fontSizeSM', base: 'fontSize', md: 'fontSizeLG', lg: 'fontSizeLG', xl: 'fontSizeXL', '2xl': 'fontSizeHeading3', '3xl': 'fontSizeHeading2', '4xl': 'fontSizeHeading2', '5xl': 'fontSizeHeading1' });
aliasGroup('radius', { sm: 'borderRadiusSM', md: 'borderRadius', lg: 'borderRadiusLG', xl: 'borderRadiusLG', '2xl': 'borderRadiusLG' });
aliasGroup('shadow', { xs: 'boxShadowTertiary', sm: 'boxShadowTertiary', md: 'boxShadow', lg: 'boxShadowSecondary', xl: 'boxShadowSecondary' });
aliasGroup('duration', { instant: 'motionDurationFast', fast: 'motionDurationFast', normal: 'motionDurationMid', slow: 'motionDurationSlow', slower: 'motionDurationSlow' });
aliasGroup('ease', { standard: 'motionEaseInOut', in: 'motionEaseInQuint', out: 'motionEaseOut', bounce: 'motionEaseOutBack', spring: 'motionEaseOutQuint' });
Object.assign(primitive, {
  '--zk-space-0': '0', '--zk-space-10': `calc(${ref('sizeMD')} * 2)`, '--zk-space-16': `calc(${ref('sizeXL')} * 2)`, '--zk-space-20': `calc(${ref('sizeMD')} * 4)`,
  '--zk-weight-regular': '400', '--zk-weight-medium': '500', '--zk-weight-semibold': ref('fontWeightStrong'), '--zk-weight-bold': '700',
  '--zk-leading-tight': ref('lineHeightHeading3'), '--zk-leading-normal': ref('lineHeight'), '--zk-leading-loose': ref('lineHeightSM'),
  '--zk-radius-none': '0', '--zk-radius-full': '9999px',
  '--zk-font-sans': ref('fontFamily'), '--zk-font-num': ref('fontFamily'), '--zk-font-mono': ref('fontFamilyCode'),
});
const semantic = {
  '--color-brand': ref('colorPrimary'), '--color-brand-hover': ref('colorPrimaryHover'), '--color-brand-active': ref('colorPrimaryActive'), '--color-brand-pressed': 'var(--color-brand-active)', '--color-brand-subtle': ref('colorPrimaryBg'), '--color-brand-muted': ref('colorPrimaryBgHover'), '--color-brand-text': ref('colorPrimaryText'), '--color-on-brand': 'var(--ds-primary-foreground)',
  '--color-secondary': ref('lime-6'), '--color-secondary-subtle': ref('lime-1'), '--color-secondary-text': ref('lime-9'), '--color-on-secondary': '#000000', '--color-accent': ref('cyan-6'), '--color-accent-subtle': ref('cyan-1'), '--color-accent-text': ref('cyan-9'), '--color-on-accent': '#000000',
  '--color-text-primary': ref('colorText'), '--color-text-secondary': ref('colorTextSecondary'), '--color-text-tertiary': ref('colorTextTertiary'), '--color-text-quaternary': ref('colorTextQuaternary'), '--color-text-disabled': ref('colorTextDisabled'), '--color-text-inverse': ref('colorTextLightSolid'), '--color-text-link': ref('colorLink'), '--color-text-link-hover': ref('colorLinkHover'),
  '--color-bg-page': ref('colorBgLayout'), '--color-bg-container': ref('colorBgContainer'), '--color-bg-elevated': ref('colorBgElevated'), '--color-bg-overlay': ref('colorBgMask'), '--color-bg-sunken': ref('colorFillAlter'), '--color-bg-brand-subtle': ref('colorPrimaryBg'), '--color-bg-disabled': ref('colorBgContainerDisabled'),
  '--color-border-light': ref('colorBorderSecondary'), '--color-border': ref('colorBorder'), '--color-border-strong': ref('colorTextQuaternary'), '--color-border-brand': ref('colorPrimaryBorder'), '--color-border-focus': ref('colorPrimary'), '--color-border-control': ref('colorBorder'), '--color-focus-ring': ref('colorPrimary'),
  '--color-danger-bg': ref('colorError'), '--color-danger-bg-hover': ref('colorErrorHover'), '--color-danger-bg-active': ref('colorErrorActive'), '--color-on-danger': ref('colorTextLightSolid'),
  '--shadow-control': ref('boxShadowTertiary'), '--shadow-card': 'none', '--shadow-card-hover': ref('boxShadowCard'), '--shadow-modal': ref('boxShadowSecondary'),
  '--space-component-xs': ref('sizeXXS'), '--space-component-sm': ref('sizeXS'), '--space-component-md': ref('sizeSM'), '--space-component-lg': ref('size'), '--space-section': ref('sizeLG'), '--space-page': ref('sizeXL'), '--radius-control': ref('borderRadius'), '--radius-card': ref('borderRadiusLG'), '--radius-modal': ref('borderRadiusLG'),
};
for (const state of ['success', 'warning', 'error', 'info']) { const name = state[0].toUpperCase() + state.slice(1); semantic[`--color-${state}`] = ref(`color${name}Text`); semantic[`--color-${state}-subtle`] = ref(`color${name}Bg`); }
const component = {
  '--btn-primary-bg': 'var(--color-brand)', '--btn-primary-bg-hover': 'var(--color-brand-hover)', '--btn-primary-bg-active': 'var(--color-brand-active)', '--btn-primary-fg': 'var(--color-on-brand)', '--btn-primary-radius': 'var(--radius-control)', '--btn-primary-shadow': 'var(--shadow-control)',
  '--btn-secondary-bg': 'var(--color-brand-subtle)', '--btn-secondary-bg-hover': 'var(--color-brand-muted)', '--btn-secondary-bg-active': 'var(--color-brand-muted)', '--btn-secondary-fg': 'var(--color-brand-text)', '--btn-secondary-radius': 'var(--radius-control)',
  '--btn-outline-bg': 'transparent', '--btn-outline-bg-hover': ref('colorBgTextHover'), '--btn-outline-bg-active': ref('colorBgTextActive'), '--btn-outline-border': 'var(--color-border-control)', '--btn-outline-fg': 'var(--color-text-primary)', '--btn-outline-radius': 'var(--radius-control)',
  '--btn-danger-bg': 'var(--color-danger-bg)', '--btn-danger-bg-hover': 'var(--color-danger-bg-hover)', '--btn-danger-bg-active': 'var(--color-danger-bg-active)', '--btn-danger-fg': 'var(--color-on-danger)', '--btn-disabled-bg': 'var(--color-bg-disabled)', '--btn-disabled-fg': 'var(--color-text-disabled)', '--btn-disabled-border': ref('colorBorderDisabled'),
  '--btn-height-sm': ref('controlHeightSM'), '--btn-height-md': ref('controlHeight'), '--btn-height-lg': ref('controlHeightLG'), '--btn-padding-x-sm': ref('controlPaddingHorizontalSM'), '--btn-padding-x-md': ref('controlPaddingHorizontal'), '--btn-padding-x-lg': ref('padding'), '--btn-font-sm': ref('fontSizeSM'), '--btn-font-md': ref('fontSize'), '--btn-font-lg': ref('fontSizeLG'),
  '--input-bg': ref('colorBgContainer'), '--input-border': ref('colorBorder'), '--input-border-hover': ref('colorPrimaryHover'), '--input-border-focus': ref('colorPrimary'), '--input-border-error': ref('colorError'), '--input-fg': ref('colorText'), '--input-placeholder': ref('colorTextPlaceholder'), '--input-radius': ref('borderRadius'), '--input-height-md': ref('controlHeight'), '--input-padding-x': ref('controlPaddingHorizontal'), '--input-focus-ring': `0 0 0 ${ref('controlOutlineWidth')} var(--color-focus-ring)`, '--input-disabled-bg': ref('colorBgContainerDisabled'), '--input-disabled-fg': ref('colorTextDisabled'), '--input-disabled-border': ref('colorBorderDisabled'),
  '--card-bg': ref('colorBgContainer'), '--card-border': ref('colorBorderSecondary'), '--card-radius': ref('borderRadiusLG'), '--card-padding': ref('paddingLG'), '--card-shadow': 'none', '--card-shadow-hover': ref('boxShadowCard'), '--badge-radius': ref('borderRadiusSM'), '--badge-padding': `2px ${ref('paddingXS')}`, '--badge-font': ref('fontSizeSM'),
  '--modal-bg': ref('colorBgElevated'), '--modal-radius': ref('borderRadiusLG'), '--modal-shadow': ref('boxShadowSecondary'), '--modal-mask': ref('colorBgMask'), '--nav-bg': ref('colorBgContainer'), '--nav-border': ref('colorBorderSecondary'), '--nav-item-fg': ref('colorTextSecondary'), '--nav-item-active-fg': ref('colorPrimary'), '--nav-height-pc': `calc(${ref('controlHeight')} * 2)`, '--nav-height-mobile': `calc(${ref('controlHeightLG')} + ${ref('sizeXXS')})`, '--nav-tab-height-mobile': '50px',
  '--tab-item-fg': ref('colorTextSecondary'), '--tab-item-active-fg': ref('colorPrimary'), '--tab-indicator': ref('colorPrimary'), '--table-header-bg': ref('colorFillAlter'), '--table-row-hover': ref('colorFillAlter'), '--table-border': ref('colorBorderSecondary'), '--switch-on': ref('colorPrimary'), '--switch-off': ref('colorTextQuaternary'), '--toast-bg': ref('colorBgSpotlight'), '--toast-fg': ref('colorTextLightSolid'), '--toast-radius': ref('borderRadius'),
};
function resolveReference(name, values, chain = []) {
  if (!(name in values)) throw new Error(`Undefined token: ${name}`);
  if (chain.includes(name)) throw new Error(`Circular token: ${[...chain, name].join(' -> ')}`);
  return values[name].replace(/var\((--[\w-]+)\)/g, (_, target) => resolveReference(target, values, [...chain, name]));
}
const modes = {}, officialPreset = {}, cssModes = {}, semanticModes = {}, contrastResults = {};
let contrastChecks = 0;
for (const [name, definition] of Object.entries(themeSource.modes)) {
  const options = { mode: definition.theme, compact: definition.density === 'compact' };
  const config = createCohesionTheme(options), tokens = getCohesionTokens(options);
  const algorithms = [definition.theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm];
  const algorithmNames = [definition.theme === 'dark' ? 'darkAlgorithm' : 'defaultAlgorithm'];
  if (options.compact) { algorithms.push(theme.compactAlgorithm); algorithmNames.push('compactAlgorithm'); }
  const seed = { ...themeSource.token, ...themeSource.modeToken[definition.theme] };
  const seededOfficial = theme.getDesignToken({ algorithm: algorithms, token: seed });
  officialPreset[name] = theme.getDesignToken({ algorithm: algorithms });
  modes[name] = { theme: definition.theme, density: definition.density, algorithms: [...algorithmNames, themeSource.accessibility.algorithm], seed, components: config.components, accessibilityAdjustments: Object.entries(tokens).filter(([key, value]) => value !== seededOfficial[key]).map(([token, value]) => ({ token, official: seededOfficial[token], value })), tokens };
  const antCss = Object.fromEntries(Object.entries(tokens).map(([key, value]) => [variable(key), cssValue(key, value)]));
  if (Object.keys(antCss).length !== Object.keys(tokens).length) throw new Error(`CSS token name collision in ${name}`);
  antCss['--ds-primary-foreground'] = definition.theme === 'dark' ? ref('colorBgContainer') : ref('colorTextLightSolid');
  cssModes[name] = antCss; semanticModes[name] = { ...semantic };
  const values = { ...antCss, ...primitive, ...semantic, ...component };
  for (const token of Object.keys(values)) resolveReference(token, values);
  if (Object.values(values).some(value => /\d+rpx\b/.test(value))) throw new Error(`Web CSS contains rpx in ${name}`);
  const checks = [], surfaces = ['colorBgLayout', 'colorBgContainer', 'colorBgElevated'];
  const textRoles = ['colorText', 'colorTextSecondary', 'colorTextTertiary', 'colorTextDescription', 'colorTextLabel', 'colorTextPlaceholder', 'colorLink', 'colorLinkHover', 'colorLinkActive', 'colorPrimaryText', 'colorPrimaryTextHover', 'colorPrimaryTextActive'];
  for (const foreground of textRoles) for (const background of surfaces) checks.push([foreground, background, 4.5]);
  for (const state of ['Success', 'Warning', 'Error', 'Info']) for (const suffix of ['', 'Hover', 'Active']) for (const background of [...surfaces, `color${state}Bg`]) checks.push([`color${state}Text${suffix}`, background, 4.5]);
  for (const background of themeSource.accessibility.readableFillTokens) for (const foreground of ['colorPrimary', 'colorPrimaryText', 'colorPrimaryTextHover', 'colorPrimaryTextActive']) checks.push([foreground, background, 4.5]);
  const primaryForeground = definition.theme === 'dark' ? 'colorBgContainer' : 'colorTextLightSolid';
  for (const suffix of ['', 'Hover', 'Active']) { checks.push([primaryForeground, `colorPrimary${suffix}`, 4.5]); checks.push(['colorTextLightSolid', `colorError${suffix}`, 4.5]); }
  for (const background of surfaces) checks.push(['colorPrimary', background, 3]);
  checks.push(['colorTextLightSolid', 'colorBgSpotlight', 4.5]);
  contrastResults[name] = checks.map(([foreground, background, minimum]) => {
    const ratio = contrastRatio(tokens[foreground], tokens[background], tokens.colorBgContainer);
    if (ratio < minimum) throw new Error(`${name}: ${foreground} on ${background} is ${ratio.toFixed(3)}:1; requires ${minimum}:1`);
    contrastChecks += 1;
    return { foreground, background, minimum, ratio: Number(ratio.toFixed(3)) };
  });
  const reduced = getCohesionTokens({ ...options, reducedMotion: true });
  if (['motionDurationFast', 'motionDurationMid', 'motionDurationSlow'].some(key => reduced[key] !== '0s')) throw new Error(`Reduced motion is not disabled in ${name}`);
}
const block = (selector, values) => `${selector} {\n${Object.entries(values).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}\n`;
const css = `/* Generated by scripts/generate-antd-tokens.mjs. Do not edit directly.
 * Source: theme/cohesion-theme.json + Ant Design ${antdVersion} official algorithms.
 * --ant-token-* mirrors resolved tokens. Dimensions use px; line-height, weight,
 * opacity and z-index remain unitless. Boolean configuration is exposed as 0/1.
 * --zk-*, --color-* and component names below are compatibility aliases.
 * Set data-theme and data-density on the same theme scope.
 * Logo colors stay fixed. Primary and accessible corrections are branded values.
 */\n\n${block(':root, [data-theme], [data-density]', { ...primitive, ...semantic, ...component })}\n${block(':root, [data-theme="light"]', cssModes.light)}\n${block('[data-theme="dark"]', cssModes.dark)}\n${block('[data-density="compact"], [data-theme="light"][data-density="compact"]', cssModes.compact)}\n${block('[data-theme="dark"][data-density="compact"], [data-theme="dark"] [data-density="compact"], [data-density="compact"] [data-theme="dark"]', cssModes.darkCompact)}
@media (prefers-reduced-motion: reduce) {
  :root, [data-theme], [data-density] {
    --ant-token-motion: 0;
    --ant-token-motion-duration-fast: 0s;
    --ant-token-motion-duration-mid: 0s;
    --ant-token-motion-duration-slow: 0s;
  }
}
[data-motion-paused="true"], [data-motion="reduced"] {
  --ant-token-motion: 0;
  --ant-token-motion-duration-fast: 0s;
  --ant-token-motion-duration-mid: 0s;
  --ant-token-motion-duration-slow: 0s;
}
`;
const snapshot = {
  $description: `COHESION ${themeSource.version} / Ant Design ${antdVersion}. Generated exchange snapshot; not DTCG. Raw tokens keep JS values; css keeps CSS strings.`,
  $extensions: { 'org.cohesion': { format: 'antd-theme-snapshot-v2', source: 'theme/cohesion-theme.json', factory: 'theme/create-theme.mjs', generator: 'scripts/generate-antd-tokens.mjs', version: themeSource.version, foundation: `antd@${antdVersion}`, disabledContrastExcluded: true, contrastChecks, cssPrefix: '--ant-token-', dimensions: 'px', modeAttributes: ['data-theme', 'data-density'] } },
  source: themeSource, officialPreset, modes, color: {}, spacing: {}, radius: {}, fontSize: {}, css: { primitive, semantic: semanticModes, component, antd: cssModes }, validation: { contrastChecks, contrast: contrastResults, reducedMotion: 'All three official duration tokens resolve to 0s in every mode.' },
};
const lightValues = { ...cssModes.light, ...primitive, ...semantic, ...component };
for (const [name] of Object.entries(primitive)) {
  const colorMatch = name.match(/^--zk-(brand|green|lime|cyan|neutral|red|orange|blue)-(.+)$/);
  if (colorMatch) { const [, group, key] = colorMatch; (snapshot.color[group] ??= {})[key] = { $value: resolveReference(name, lightValues), $type: 'color' }; }
  for (const [prefix, group] of [['space', 'spacing'], ['radius', 'radius'], ['text', 'fontSize']]) if (name.startsWith(`--zk-${prefix}-`)) snapshot[group][name.slice(prefix.length + 6)] = { $value: resolveReference(name, lightValues), $type: 'dimension' };
}
const json = `${JSON.stringify(snapshot, null, 2)}\n`;
const themeJson = await readFile(new URL('theme/cohesion-theme.json', root), 'utf8');
const themeFactory = await readFile(new URL('theme/create-theme.mjs', root), 'utf8');
for (const [path, expected] of [['tokens/tokens.css', css], ['tokens/tokens.json', json], ['dist/tokens/cohesion-tokens.css', css], ['dist/tokens/cohesion-tokens.json', json], ['dist/theme/cohesion-theme.json', themeJson], ['dist/theme/create-theme.mjs', themeFactory]]) {
  const url = new URL(path, root);
  if (checkOnly) {
    let actual;
    try { actual = await readFile(url, 'utf8'); } catch { throw new Error(`Missing token output: ${path}. Run pnpm tokens:generate.`); }
    if (actual !== expected) throw new Error(`Outdated token output: ${path}. Run pnpm tokens:generate.`);
  } else { await mkdir(dirname(fileURLToPath(url)), { recursive: true }); await writeFile(url, expected); }
}
console.log(`${checkOnly ? 'Checked' : 'Generated'} Ant Design ${antdVersion}: ${Object.keys(modes.light.tokens).length} tokens × ${Object.keys(modes).length} modes, ${contrastChecks} contrast checks; reduced motion and CSS/JSON mirrors passed.`);
