import plugin from 'tailwindcss/plugin';
import { cohesionMotionBase } from './cohesion-motion.mjs';

export default plugin(({ addBase }) => addBase(cohesionMotionBase));
