import React, { useEffect, useRef, useState } from 'react';
import { cohesionBaseClasses } from '../css/cohesion-base.classes.mjs';
import { useReducedMotion } from './hooks.jsx';

/** Canvas wrapper for js/orbs-engine.js + js/orbs-presets.js.
 * Load both IIFE files before mounting. No React globals are needed by these engines.
 */
const LABELS = {
  breathing: 'Thinking…', working: 'Working…', searching: 'Searching…',
  solving: 'Solving…', listening: 'Listening…', connecting: 'Connecting…',
  weaving: 'Weaving…', composing: 'Composing…', shaping: 'Shaping…',
};

function useDark(theme, ref) {
  const [dark, setDark] = useState(theme === 'dark');
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const update = () => {
      const inherited = ref.current?.closest('[data-theme]')?.dataset.theme;
      setDark(theme === 'dark' || (theme !== 'light' && (inherited === 'dark' || (inherited !== 'light' && !!media?.matches))));
    };
    update();
    media?.addEventListener?.('change', update);
    if (!media?.addEventListener) media?.addListener?.(update);
    const observer = typeof MutationObserver !== 'undefined' ? new MutationObserver(update) : null;
    observer?.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-theme'] });
    return () => {
      observer?.disconnect();
      media?.removeEventListener?.('change', update);
      if (!media?.removeEventListener) media?.removeListener?.(update);
    };
  }, [theme, ref]);
  return dark;
}

export function ThinkingOrb({ state = 'breathing', size = 64, speed = 1, theme = 'auto', paused = false, className = '', style, onError, 'aria-label': ariaLabel, ...props }) {
  const canvasRef = useRef(null);
  const timeRef = useRef(0.6);
  const errorRef = useRef(onError);
  errorRef.current = onError;
  const [status, setStatus] = useState('loading');
  const reduced = useReducedMotion();
  const dark = useDark(theme, canvasRef);
  const knownState = Object.prototype.hasOwnProperty.call(LABELS, state) ? state : 'breathing';
  const pixels = Number.isFinite(size) && size > 0 ? size : 64;
  const rate = Number.isFinite(speed) ? Math.min(2, Math.max(0, speed)) : 1;
  const label = ariaLabel || LABELS[knownState];

  useEffect(() => {
    let disposed = false, failed = false, timer = 0, raf = 0, observer = null;
    let running = false, visible = true, lastTime = 0;
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const startedAt = Date.now();
    const fail = (error) => {
      if (disposed || failed) return;
      failed = true;
      stop();
      window.clearTimeout(timer);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      setStatus('error');
      errorRef.current?.(error);
    };
    let onVisibility = () => {};
    const initialize = () => {
      if (disposed) return;
      const engine = window.__orbs;
      if (!engine?.MODE_DRAWS || typeof engine.resolvePreset !== 'function') {
        if (Date.now() - startedAt >= 5000) return fail(new Error('ThinkingOrb requires js/orbs-engine.js and js/orbs-presets.js.'));
        timer = window.setTimeout(initialize, 50);
        return;
      }
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        // Only 20px uses the compact preset; other sizes use the 64px reference.
        const tuned = pixels === 20 ? 20 : 64;
        canvas.width = Math.round(tuned * dpr);
        canvas.height = Math.round(tuned * dpr);
        const context = canvas.getContext('2d');
        if (!context) return fail(new Error('Canvas 2D is unavailable.'));
        const { mode, speed: baseSpeed, opts } = engine.resolvePreset(knownState, tuned);
        const draw = engine.MODE_DRAWS[mode];
        if (typeof draw !== 'function') return fail(new Error(`Unknown orb mode: ${mode}`));
        const effectiveSpeed = (Number.isFinite(baseSpeed) ? baseSpeed : 1) * rate;
        const frame = () => {
          context.setTransform(dpr, 0, 0, dpr, 0, 0);
          context.clearRect(0, 0, tuned, tuned);
          draw(context, tuned, timeRef.current, dark, opts);
        };
        const loop = (now) => {
          if (!running || disposed) return;
          timeRef.current += Math.max(0, (now - lastTime) / 1000) * effectiveSpeed;
          lastTime = now;
          try { frame(); } catch (error) { fail(error); return; }
          raf = requestAnimationFrame(loop);
        };
        const start = () => {
          if (running || disposed || failed || paused || reduced || effectiveSpeed === 0 || !visible || document.visibilityState === 'hidden') return;
          running = true;
          lastTime = performance.now();
          raf = requestAnimationFrame(loop);
        };
        frame();
        setStatus('ready');
        if (typeof IntersectionObserver !== 'undefined') {
          visible = false;
          observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start(); else stop();
          });
          observer.observe(canvas);
        }
        onVisibility = () => { if (document.visibilityState === 'hidden') stop(); else start(); };
        document.addEventListener('visibilitychange', onVisibility);
        if (!observer) start();
      } catch (error) { fail(error); }
    };
    initialize();
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [knownState, pixels, rate, dark, paused, reduced]);

  return (
    <span {...props} className={[cohesionBaseClasses.orb, className].filter(Boolean).join(' ')} data-orb-status={status} style={{ '--orb-size': `${pixels}px`, ...style }}>
      <canvas ref={canvasRef} role="img" aria-label={label} className={cohesionBaseClasses.orbCanvas}>{label}</canvas>
      {status === 'error' && <span role="img" aria-label={label} className={cohesionBaseClasses.orbFallback}>{label}</span>}
    </span>
  );
}

export const ORB_STATES = Object.keys(LABELS);
export default ThinkingOrb;
