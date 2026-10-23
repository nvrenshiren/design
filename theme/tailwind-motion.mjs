import plugin from 'tailwindcss/plugin';
import { transitionKeyframes } from '../preview/shadcn/transitions/motion.config.mjs';

// Only animation recipes live here. Layout and component states are utilities
// at their point of use, rather than custom selectors hidden in a plugin.
export default plugin(({ addBase }) => {
  addBase(Object.fromEntries(Object.entries(transitionKeyframes).map(([name, frames]) => [`@keyframes ${name}`, frames])));
});
