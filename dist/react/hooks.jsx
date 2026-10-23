import React, { useCallback, useEffect, useRef, useState } from 'react';

const THEME_KEY = 'zk-theme';
const THEME_EVENT = 'cohesion-theme-change';
const isTheme = (value) => value === 'light' || value === 'dark';

function readPreference() {
  if (typeof window === 'undefined') return 'system';
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    if (isTheme(value)) return value;
  } catch (_) {}
  try {
    const value = document.cookie.match(/(?:^|;\s*)zk-theme=([^;]+)/)?.[1];
    if (isTheme(value)) return value;
  } catch (_) {}
  return 'system';
}

function systemTheme() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function listenMedia(media, listener) {
  if (!media) return () => {};
  if (media.addEventListener) {
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }
  media.addListener?.(listener);
  return () => media.removeListener?.(listener);
}

/** Returns [resolvedTheme, setTheme, preference]. setTheme accepts light/dark/system.
 * Only an explicit choice is persisted; visiting the page does not disable system following.
 * Call once near the application root. Browser globals are only accessed with guards.
 */
export function useCohesionTheme() {
  const [preference, setPreference] = useState(readPreference);
  const [system, setSystem] = useState(systemTheme);
  const theme = preference === 'system' ? system : preference;
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const setTheme = useCallback((value) => {
    const next = typeof value === 'function' ? value(themeRef.current) : value;
    if (!isTheme(next) && next !== 'system') return;
    setPreference(next);
    if (typeof window === 'undefined') return;
    try {
      if (next === 'system') window.localStorage.removeItem(THEME_KEY);
      else window.localStorage.setItem(THEME_KEY, next);
    } catch (_) {}
    try {
      document.cookie = next === 'system'
        ? 'zk-theme=;path=/;max-age=0;samesite=lax'
        : `zk-theme=${next};path=/;max-age=31536000;samesite=lax`;
    } catch (_) {}
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    setSystem(media?.matches ? 'dark' : 'light');
    const removeMedia = listenMedia(media, (event) => setSystem(event.matches ? 'dark' : 'light'));
    const onStorage = (event) => {
      if (event.key === null || event.key === THEME_KEY) {
        setPreference(isTheme(event.newValue) ? event.newValue : 'system');
      }
    };
    const onChoice = (event) => {
      if (isTheme(event.detail) || event.detail === 'system') setPreference(event.detail);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(THEME_EVENT, onChoice);
    return () => {
      removeMedia();
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(THEME_EVENT, onChoice);
    };
  }, []);
  return [theme, setTheme, preference];
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    setReduced(!!media?.matches);
    return listenMedia(media, (event) => setReduced(event.matches));
  }, []);
  return reduced;
}

/** One-shot visibility observation. Without IntersectionObserver, content is immediately in view. */
export function useInView({ root = null, rootMargin = '0px', threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const thresholdKey = JSON.stringify(threshold);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(element);
      }
    }, { root, rootMargin, threshold: JSON.parse(thresholdKey) });
    observer.observe(element);
    return () => observer.disconnect();
  }, [root, rootMargin, thresholdKey]);
  return [ref, inView];
}

/** Content stays visible before JS/observation; motion is optional progressive enhancement. */
export function RevealOnScroll({ children, className = '', delay = 0, as: Tag = 'div', style, ...props }) {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const played = useRef(false);
  useEffect(() => {
    if (!inView || played.current || reduced || !ref.current?.animate) return;
    played.current = true;
    const animation = ref.current.animate([
      { opacity: 0.7, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 500, delay: Math.max(0, Number(delay) || 0), easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'none' });
    return () => animation.cancel();
  }, [inView, reduced, delay]);
  return <Tag {...props} ref={ref} className={className} style={style}>{children}</Tag>;
}
