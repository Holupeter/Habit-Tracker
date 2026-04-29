'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration(): null {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => navigator.serviceWorker.ready.catch(() => {}))
        .then(() => {
          // In some dev setups a service worker may not control the current page
          // until the next navigation. Reload at most once to avoid loops.
          if (navigator.serviceWorker.controller) return;
          try {
            const key = '__habit_tracker_sw_reload_once__';
            if (window.sessionStorage.getItem(key) === '1') return;
            window.sessionStorage.setItem(key, '1');
            window.location.reload();
          } catch {
            // ignore
          }
        })
        .catch(() => {});
    };
    if (document.readyState === 'complete') {
      onLoad();
      return;
    }
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}
