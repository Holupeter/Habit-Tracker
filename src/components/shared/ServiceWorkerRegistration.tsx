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
          if (!navigator.serviceWorker.controller) {
            window.location.reload();
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
