/**
 * COHESION Tailwind v3 preset. Load tokens/cohesion-tokens.css before using it.
 * Node: presets: [require('./cohesion-tailwind.preset.js')]
 * Browser preview: window.cohesionTailwindPreset
 * Optional compatibility bridge for Tailwind v3; the component baseline is antd.
 * Values resolve from generated Ant Design tokens in all four theme modes.
 * Palette utilities use official presets. Fixed Logo colors have separate names.
 */
(function (root, factory) {
  const preset = factory();
  if (typeof module === 'object' && module.exports) module.exports = preset;
  else if (root) root.cohesionTailwindPreset = preset;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const variable = (name) => `var(--${name})`;
  const scale = (name, steps = [50,100,200,300,400,500,600,700,800,900]) => Object.fromEntries(steps.map(step => [step, variable(`zk-${name}-${step}`)]));
  const semantic = (name) => variable(`color-${name}`);
  const ant = (name) => variable(`ant-token-${name}`);
  const sizes = ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
  return {
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: semantic('brand'), text: semantic('brand-text'), hover: semantic('brand-hover'), active: semantic('brand-active'),
            subtle: semantic('brand-subtle'), muted: semantic('brand-muted'), border: semantic('border-brand'),
          },
          'on-brand': semantic('on-brand'),
          ink: semantic('text-primary'), secondary: semantic('text-secondary'), muted: semantic('text-tertiary'),
          faint: semantic('text-quaternary'), disabled: semantic('text-disabled'), inverse: semantic('text-inverse'),
          link: { DEFAULT: semantic('text-link'), hover: semantic('text-link-hover') },
          page: semantic('bg-page'), surface: semantic('bg-container'), elevated: semantic('bg-elevated'), sunken: semantic('bg-sunken'),
          overlay: semantic('bg-overlay'), 'disabled-bg': semantic('bg-disabled'),
          divider: semantic('border-light'), default: semantic('border'), strong: semantic('border-strong'), control: semantic('border-control'),
          focus: semantic('border-focus'), 'focus-ring': semantic('focus-ring'),
          success: semantic('success'), 'success-subtle': semantic('success-subtle'),
          warning: semantic('warning'), 'warning-subtle': semantic('warning-subtle'),
          danger: semantic('error'), 'danger-subtle': semantic('error-subtle'),
          'danger-bg': semantic('danger-bg'), 'danger-hover': semantic('danger-bg-hover'), 'danger-active': semantic('danger-bg-active'), 'on-danger': semantic('on-danger'),
          info: semantic('info'), 'info-subtle': semantic('info-subtle'),
          lime: { ...scale('lime'), DEFAULT: semantic('secondary'), subtle: semantic('secondary-subtle'), text: semantic('secondary-text') },
          'on-secondary': semantic('on-secondary'),
          cyanb: { ...scale('cyan'), DEFAULT: semantic('accent'), subtle: semantic('accent-subtle'), text: semantic('accent-text') },
          'on-accent': semantic('on-accent'),
          zk: scale('neutral', [0,50,100,200,300,400,500,600,700,800,900]),
          green: scale('green'),
          logo: { green: variable('zk-brand-green'), lime: variable('zk-brand-lime'), cyan: variable('zk-brand-cyan'), gray: variable('zk-brand-gray') },
        },
        fontFamily: {
          sans: [variable('zk-font-sans')], display: [variable('zk-font-sans')],
          mono: [variable('zk-font-mono')], num: [variable('zk-font-num')],
        },
        fontSize: Object.fromEntries(sizes.map((name, index) => [`zk-${name}`, [variable(`zk-text-${name}`), variable(index < 4 ? 'zk-leading-normal' : 'zk-leading-tight')]])),
        spacing: Object.fromEntries(Object.entries({ xxs: 'xxs', xs: 'xs', sm: 'sm', DEFAULT: '', md: 'md', lg: 'lg', xl: 'xl', xxl: 'xxl' }).map(([name, token]) => [`ant${name === 'DEFAULT' ? '' : `-${name}`}`, ant(`size${token ? `-${token}` : ''}`)])),
        height: { 'ant-control-sm': ant('control-height-sm'), 'ant-control': ant('control-height'), 'ant-control-lg': ant('control-height-lg') },
        borderRadius: Object.fromEntries(['sm','md','lg','xl','2xl'].map(name => [`zk-${name}`, variable(`zk-radius-${name}`)])),
        boxShadow: {
          ...Object.fromEntries(['xs','sm','md','lg','xl'].map(name => [`zk-${name}`, variable(`zk-shadow-${name}`)])),
          btn: variable('shadow-control'), card: variable('shadow-card'), 'card-hover': variable('shadow-card-hover'), modal: variable('shadow-modal'),
        },
        transitionTimingFunction: {
          'zk-standard': variable('zk-ease-standard'), 'zk-in': variable('zk-ease-in'), 'zk-out': variable('zk-ease-out'),
          'zk-bounce': variable('zk-ease-bounce'), 'zk-spring': variable('zk-ease-spring'),
        },
        transitionDuration: { 'ant-fast': ant('motion-duration-fast'), 'ant-mid': ant('motion-duration-mid'), 'ant-slow': ant('motion-duration-slow') },
      },
    },
  };
});
