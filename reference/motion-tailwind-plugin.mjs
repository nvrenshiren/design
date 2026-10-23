import plugin from 'tailwindcss/plugin';
import { referenceMotions } from './transitions/motions.mjs';

// Only motion recipes become at-rules. All element styles are Tailwind utilities.
export default plugin(({ addBase }) => {
  addBase(Object.fromEntries(Object.entries(referenceMotions).map(([name, frames]) => [`@keyframes ${name}`, frames])));
});
