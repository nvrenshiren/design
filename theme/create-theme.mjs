import { theme } from 'antd';
import source from './cohesion-theme.json' with { type: 'json' };

export const themeSource = source;

/** Color utilities support Ant Design's opaque hex and rgba neutral tokens. */
export function parseColor(value) {
  if (value === 'transparent') return [0, 0, 0, 0];
  const hex = value.match(/^#([\da-f]{3,8})$/i)?.[1];
  if (hex) {
    const normalized = hex.length <= 4 ? [...hex].map(char => char + char).join('') : hex;
    if (![6, 8].includes(normalized.length)) throw new Error(`Unsupported hex color: ${value}`);
    const channels = normalized.match(/../g).map(part => parseInt(part, 16));
    return [...channels.slice(0, 3), channels.length === 4 ? channels[3] / 255 : 1];
  }
  const rgb = value.match(/^rgba?\(([^)]+)\)$/i)?.[1];
  if (!rgb) throw new Error(`Unsupported color: ${value}`);
  const parts = rgb.replaceAll(',', ' ').replace('/', ' ').trim().split(/\s+/);
  return [...parts.slice(0, 3).map(part => part.endsWith('%') ? Number.parseFloat(part) * 2.55 : Number(part)), parts[3] === undefined ? 1 : Number(parts[3])];
}

export function compositeColor(foreground, background) {
  const fg = Array.isArray(foreground) ? foreground : parseColor(foreground);
  const bg = Array.isArray(background) ? background : parseColor(background);
  const alpha = fg[3] + bg[3] * (1 - fg[3]);
  if (!alpha) return [0, 0, 0, 0];
  return [...fg.slice(0, 3).map((value, index) => (value * fg[3] + bg[index] * bg[3] * (1 - fg[3])) / alpha), alpha];
}

function luminance(value) {
  const rgb = value.slice(0, 3).map(channel => channel / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

export function contrastRatio(foreground, background, canvas = '#ffffff') {
  const bg = compositeColor(background, canvas);
  const fg = compositeColor(foreground, bg);
  const light = luminance(fg), dark = luminance(bg);
  return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
}

const hexColor = rgb => `#${rgb.slice(0, 3).map(channel => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;

/** Adjust only failing values, preserving hue by blending toward a neutral. */
function readableColor(value, backgrounds, minimum, target) {
  if (backgrounds.every(background => contrastRatio(value, background) >= minimum)) return value;
  const original = parseColor(value);
  if (original[3] < 1) {
    for (let step = 1; step <= 1000; step += 1) {
      const alpha = Math.min(1, original[3] + step / 1000);
      const candidate = `rgba(${original.slice(0, 3).join(',')},${Number(alpha.toFixed(3))})`;
      if (backgrounds.every(background => contrastRatio(candidate, background) >= minimum + 0.01)) return candidate;
    }
  }
  const endpoint = parseColor(target);
  for (let step = 1; step <= 1000; step += 1) {
    const amount = step / 1000;
    const candidate = hexColor(original.map((channel, index) => index < 3 ? channel + (endpoint[index] - channel) * amount : 1));
    if (backgrounds.every(background => contrastRatio(candidate, background) >= minimum + 0.01)) return candidate;
  }
  throw new Error(`Cannot make ${value} readable on ${backgrounds.join(', ')}`);
}

/**
 * This official algorithm extension is shared by ConfigProvider and generation.
 * Map-token corrections happen before Ant Design derives aliases, so selected
 * fills, descriptions, outlines and all components stay in the same system.
 */
export function cohesionAccessibilityAlgorithm(seedToken, mapToken) {
  const token = { ...mapToken };
  const backgrounds = [token.colorBgLayout, token.colorBgContainer, token.colorBgElevated];
  const dark = luminance(parseColor(token.colorBgContainer)) < 0.5;
  const minimum = source.accessibility.minimumTextContrast;
  for (const key of source.accessibility.textTokens) {
    const family = key.match(/^color(Success|Warning|Error|Info)Text/)?.[1];
    const surfaces = family ? [...backgrounds, token[`color${family}Bg`]] : backgrounds;
    token[key] = readableColor(token[key], surfaces, minimum, dark ? '#ffffff' : '#000000');
  }
  // A brighter dark-theme primary is readable in tabs, selection and navigation.
  // Its Button primaryColor uses the official dark container role; danger keeps
  // the official light solid foreground in both themes.
  for (const key of source.accessibility.solidButtonTokens) {
    const foreground = dark && key.startsWith('colorPrimary') ? token.colorBgContainer : token.colorWhite;
    if (contrastRatio(foreground, token[key]) < minimum) {
      token[key] = readableColor(token[key], [foreground], minimum, dark && key.startsWith('colorPrimary') ? '#ffffff' : '#000000');
    }
  }
  for (const key of source.accessibility.readableFillTokens) {
    const foregrounds = [token.colorPrimary];
    const endpoint = token.colorBgContainer;
    const original = parseColor(token[key]);
    const target = parseColor(endpoint);
    if (foregrounds.some(foreground => contrastRatio(foreground, token[key]) < minimum)) {
      for (let step = 1; step <= 1000; step += 1) {
        const amount = step / 1000;
        const candidate = hexColor(original.map((channel, index) => index < 3 ? channel + (target[index] - channel) * amount : 1));
        if (foregrounds.every(foreground => contrastRatio(foreground, candidate) >= minimum + 0.001)) {
          token[key] = candidate;
          break;
        }
      }
    }
  }
  // Colored containers and text share this readability contract. State text
  // may need a stronger tone than standalone links on an uncolored surface.
  const primarySurfaces = [...backgrounds, ...source.accessibility.readableFillTokens.map(key => token[key])];
  for (const key of ['colorPrimaryText', 'colorPrimaryTextHover', 'colorPrimaryTextActive']) {
    token[key] = readableColor(token[key], primarySurfaces, minimum, dark ? '#ffffff' : '#000000');
  }
  return token;
}

const configCache = new Map();

export function createCohesionTheme({ mode = 'light', compact = false, reducedMotion = false } = {}) {
  if (!['light', 'dark'].includes(mode)) throw new Error(`Unknown theme mode: ${mode}`);
  const key = `${mode}:${Boolean(compact)}:${Boolean(reducedMotion)}`;
  if (!configCache.has(key)) {
    const algorithms = [mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm];
    if (compact) algorithms.push(theme.compactAlgorithm);
    algorithms.push(cohesionAccessibilityAlgorithm);
    const base = { algorithm: algorithms, token: { ...source.token, ...source.modeToken[mode] } };
    const resolved = theme.getDesignToken(base);
    const config = {
      ...base,
      token: {
        ...source.token,
        ...source.modeToken[mode],
        // Placeholder is an Alias Token; override it without changing disabled
        // or decorative quaternary colors that share the official source role.
        colorTextPlaceholder: resolved.colorTextTertiary,
        ...(reducedMotion ? { motion: false } : {}),
      },
      components: {
        ...source.components,
        ...(mode === 'dark' ? { Button: { ...source.components.Button, primaryColor: resolved.colorBgContainer } } : {}),
      },
    };
    configCache.set(key, config);
  }
  return configCache.get(key);
}

export const createTheme = createCohesionTheme;
export const getCohesionTokens = options => theme.getDesignToken(createCohesionTheme(options));
export default createCohesionTheme;
