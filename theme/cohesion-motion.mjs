/**
 * Product-level motion recipes shared by the COHESION preview and Tailwind
 * plugin. Keep these small, purposeful transitions separate from the
 * experimental transition gallery.
 */
export const cohesionMotionKeyframes = {
  'cohesion-page-enter': {
    from: { opacity: '0', transform: 'translateY(8px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'cohesion-dialog-content-enter': {
    from: { opacity: '0', transform: 'translateY(8px) scale(.99)' },
    to: { opacity: '1', transform: 'translateY(0) scale(1)' },
  },
  'cohesion-option-enter': {
    from: { opacity: '0', transform: 'translateY(-3px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
};

const motionSelectors = [
  '.cohesion-motion-page',
  '.cohesion-motion-dialog-content',
  '.cohesion-motion-menu-item',
  '.cohesion-motion-select-option',
].join(', ');

export const cohesionMotionBase = {
  ...Object.fromEntries(Object.entries(cohesionMotionKeyframes).map(([name, frames]) => [`@keyframes ${name}`, frames])),
  '.cohesion-motion-page': {
    animation: 'cohesion-page-enter 240ms cubic-bezier(.16, 1, .3, 1) backwards',
  },
  '.cohesion-motion-dialog-content': {
    animation: 'cohesion-dialog-content-enter 220ms cubic-bezier(.16, 1, .3, 1) backwards',
  },
  '.cohesion-motion-menu-item, .cohesion-motion-select-option': {
    animation: 'cohesion-option-enter 180ms cubic-bezier(.16, 1, .3, 1) var(--cohesion-motion-delay, 0ms) backwards',
  },
  '.cohesion-motion-card': {
    transition: 'transform var(--ant-token-motion-duration-mid, 200ms) var(--ant-token-motion-ease-out, cubic-bezier(.215, .61, .355, 1)), box-shadow var(--ant-token-motion-duration-mid, 200ms) var(--ant-token-motion-ease-out, cubic-bezier(.215, .61, .355, 1)), border-color var(--ant-token-motion-duration-mid, 200ms) var(--ant-token-motion-ease-out, cubic-bezier(.215, .61, .355, 1))',
  },
  '.cohesion-motion-card:hover, .cohesion-motion-card:focus-within': {
    transform: 'translateY(-3px)',
    boxShadow: 'var(--ant-token-box-shadow-secondary)',
    borderColor: 'var(--ant-token-color-primary-border)',
  },
  '.cohesion-motion-card:active': {
    transform: 'translateY(-1px)',
  },
  '@media (prefers-reduced-motion: reduce)': {
    [motionSelectors]: { animation: 'none !important' },
    '.cohesion-motion-card': { transition: 'none !important', transform: 'none !important' },
  },
  '[data-motion="reduced"]': {
    [motionSelectors]: { animation: 'none !important' },
    '.cohesion-motion-card, .cohesion-motion-card:hover, .cohesion-motion-card:focus-within, .cohesion-motion-card:active': {
      transition: 'none !important',
      transform: 'none !important',
    },
  },
};
