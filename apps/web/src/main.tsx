import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { registerServiceWorker } from './pwa/sw-registration';
import { usePwaStore } from './store/pwa.store';

if (import.meta.env.MODE !== 'test') {
  void registerServiceWorker({
    onUpdateAvailable: (applyUpdate) => {
      usePwaStore.getState().setPendingUpdate(applyUpdate);
    },
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
