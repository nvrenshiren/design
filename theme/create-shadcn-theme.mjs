import preset from './shadcn-preset.json' with { type: 'json' };
import { createCohesionTheme, getCohesionTokens } from './create-theme.mjs';

/** Preserve the official Neutral foundation, then map shared brand roles once. */
export function getCohesionShadcnTokens({ mode = 'light' } = {}) {
  if (!['light', 'dark'].includes(mode)) throw new Error(`Unknown shadcn theme: ${mode}`);
  const dark = mode === 'dark';
  const token = getCohesionTokens({ mode });
  const config = createCohesionTheme({ mode });
  const primaryForeground = config.components?.Button?.primaryColor || token.colorTextLightSolid;
  return {
    ...preset[mode],
    background: token.colorBgContainer,
    card: dark ? token.colorBgElevated : token.colorBgContainer,
    popover: token.colorBgElevated,
    primary: token.colorPrimary,
    'primary-foreground': primaryForeground,
    'primary-hover': token.colorPrimaryHover,
    'primary-active': token.colorPrimaryActive,
    link: token.colorLink,
    'link-hover': token.colorLinkHover,
    'link-active': token.colorLinkActive,
    accent: token.colorPrimaryBg,
    'accent-foreground': token.colorPrimaryText,
    ring: token.colorPrimary,
    // A readable error label and a filled danger button need different pairs.
    destructive: token.colorErrorText,
    'destructive-solid': token.colorError,
    'destructive-foreground': token.colorTextLightSolid,
    'destructive-hover': token.colorErrorHover,
    'destructive-active': token.colorErrorActive,
    'chart-1': token.colorPrimary,
    'chart-2': token[dark ? 'cyan6' : 'cyan8'],
    'chart-3': token[dark ? 'geekblue8' : 'geekblue6'],
    'chart-4': token[dark ? 'gold6' : 'gold8'],
    'chart-5': token[dark ? 'magenta8' : 'magenta7'],
    'sidebar-primary': token.colorPrimary,
    'sidebar-primary-foreground': primaryForeground,
    'sidebar-accent': token.colorPrimaryBg,
    'sidebar-accent-foreground': token.colorPrimaryText,
    'sidebar-ring': token.colorPrimary,
  };
}

export function getCohesionShadcnTheme() {
  return {
    ...preset,
    source: {
      ...preset.source,
      theme: 'COHESION',
      presetSource: 'theme/shadcn-preset.json',
      brandSource: 'theme/cohesion-theme.json',
      resolver: 'theme/create-shadcn-theme.mjs',
      note: 'COHESION brand theme on the official New York / Neutral foundation. Shared action, focus, selection, danger, surface and chart roles derive from the existing brand theme. Official component proportions and Radix behavior are retained; local component variants consume opaque semantic state colors and visible focus rings. This is a customized theme, not the unmodified official Neutral preset.',
    },
    light: getCohesionShadcnTokens({ mode: 'light' }),
    dark: getCohesionShadcnTokens({ mode: 'dark' }),
  };
}
