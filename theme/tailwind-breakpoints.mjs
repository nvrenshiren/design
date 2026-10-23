import plugin from 'tailwindcss/plugin';

// Inclusive legacy viewport thresholds. Register wide-to-narrow so tighter
// conditions retain precedence when several breakpoints match.
export const inclusiveBreakpoints = [1250,1199,1100,1023,1000,900,767,700,500,480,440,360];
export default plugin(({ addVariant }) => {
  for (const width of inclusiveBreakpoints) addVariant('at-most-' + String(width).replace('.', '-'), '@media (max-width: ' + width + 'px)');
});
