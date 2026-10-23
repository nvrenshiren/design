import React, { useEffect, useRef, useState } from 'react';

const pendingBundles = new Map();

/** Bridge the application's actual React instance before evaluating the IIFE.
 * The IIFE captures window.React at load time. ReactDOM globals are not required.
 */
export function loadBorderBeam(bundleUrl = '/cohesion/js/border-beam.js') {
  if (typeof window === 'undefined') return Promise.reject(new Error('BorderBeam can only be loaded in a browser.'));
  if (window.React && window.React !== React) {
    return Promise.reject(new Error('BorderBeam requires the same React instance as the application. Remove the extra React UMD script before loading the bundle.'));
  }
  window.React = React;
  if (window.borderBeam?.BorderBeam) return Promise.resolve(window.borderBeam.BorderBeam);
  if (pendingBundles.has(bundleUrl)) return pendingBundles.get(bundleUrl);
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = bundleUrl;
    script.async = true;
    let settled = false;
    let timeout = 0;
    const cleanup = () => {
      window.clearTimeout(timeout);
      script.onerror = null;
      script.onload = null;
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      cleanup();
      script.remove();
      reject(new Error(`BorderBeam bundle could not be loaded: ${bundleUrl}`));
    };
    script.onerror = fail;
    script.onload = () => {
      if (!window.borderBeam?.BorderBeam) return fail();
      settled = true;
      cleanup();
      resolve(window.borderBeam.BorderBeam);
    };
    timeout = window.setTimeout(fail, 15000);
    document.head.appendChild(script);
  }).catch((error) => {
    pendingBundles.delete(bundleUrl);
    throw error;
  });
  pendingBundles.set(bundleUrl, promise);
  return promise;
}

/** Directly render the vendor component in the application's React tree.
 * No nested root: context, children updates and effect cleanup belong to the parent tree.
 * bundleUrl must match the location where the IIFE was copied by the consuming app.
 */
export function BorderBeam({ size = 'md', colorVariant = 'colorful', theme = 'light', strength = 1, className = '', children, style, bundleUrl = '/cohesion/js/border-beam.js', onError, ...props }) {
  const [component, setComponent] = useState(null);
  const errorRef = useRef(onError);
  errorRef.current = onError;
  useEffect(() => {
    let disposed = false;
    loadBorderBeam(bundleUrl).then((Beam) => {
      if (!disposed) setComponent(() => Beam);
    }).catch((error) => {
      if (disposed) return;
      if (errorRef.current) errorRef.current(error);
      else console.error('[BorderBeam]', error);
    });
    return () => { disposed = true; };
  }, [bundleUrl]);
  if (!component) return <div className={className} style={style}>{children}</div>;
  return React.createElement(component, { ...props, size, colorVariant, theme, strength, className, style }, children);
}

export default BorderBeam;
