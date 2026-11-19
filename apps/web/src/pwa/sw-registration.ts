export interface ServiceWorkerRegistrationCallbacks {
  onUpdateAvailable: (applyUpdate: () => void) => void;
}

/**
 * Registers OpenBarrio's minimal versioned Service Worker (`/sw.js`) and surfaces
 * pending updates strictly for manual user activation (no automatic skipWaiting).
 */
export async function registerServiceWorker(
  callbacks: ServiceWorkerRegistrationCallbacks
): Promise<ServiceWorkerRegistration | null> {
  if (
    typeof window === 'undefined' ||
    typeof navigator === 'undefined' ||
    !('serviceWorker' in navigator)
  ) {
    return null;
  }

  let hasReloadedOnControllerChange = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hasReloadedOnControllerChange) return;
    hasReloadedOnControllerChange = true;
    window.location.reload();
  });

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    const notifyWaiting = (worker: ServiceWorker | null) => {
      if (!worker) return;
      callbacks.onUpdateAvailable(() => {
        worker.postMessage({ type: 'SKIP_WAITING' });
      });
    };

    if (registration.waiting) {
      notifyWaiting(registration.waiting);
    }

    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          notifyWaiting(registration.waiting || installing);
        }
      });
    });

    return registration;
  } catch {
    return null;
  }
}
