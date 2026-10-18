import {
  ExtensionConfig,
  ExtensionResponse,
} from '../shared/messages.js';
import { DEFAULT_CONFIG, PRODUCTION_CONFIG } from '../shared/config.js';

let currentConfig: ExtensionConfig = DEFAULT_CONFIG;

async function initPopup(): Promise<void> {
  await loadTabStatus();
  await loadConfiguration();
  await checkApiHealth();
  setupEventListeners();
}

async function loadTabStatus(): Promise<void> {
  const tabDesc = document.getElementById('tab-desc');
  const portalBadge = document.getElementById('portal-badge');
  const portalName = document.getElementById('portal-name');

  if (!tabDesc || !portalBadge || !portalName) return;

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    const url = activeTab?.url || '';

    if (url.includes('idealista.com/inmueble/')) {
      tabDesc.textContent = 'Anuncio de inmueble detectado. El widget oficial de OpenBarrio está inyectado en esta página.';
      portalBadge.classList.remove('hidden');
      portalName.textContent = 'Idealista · Widget Activo';
    } else if (url.includes('fotocasa.es') && (url.includes('/comprar/') || url.includes('/alquiler/'))) {
      tabDesc.textContent = 'Anuncio de inmueble detectado. El widget oficial de OpenBarrio está inyectado en esta página.';
      portalBadge.classList.remove('hidden');
      portalName.textContent = 'Fotocasa · Widget Activo';
    } else {
      tabDesc.textContent = 'No estás en una ficha de inmueble. Navega a un anuncio en Idealista o Fotocasa para ver la auditoría instantánea.';
      portalBadge.classList.add('hidden');
    }
  } catch {
    tabDesc.textContent = 'Abre una ficha de anuncio en Idealista o Fotocasa para auditarla.';
  }
}

async function loadConfiguration(): Promise<void> {
  const apiUrlInput = document.getElementById('api-url') as HTMLInputElement | null;
  const webUrlInput = document.getElementById('web-url') as HTMLInputElement | null;
  const webLink = document.getElementById('web-link') as HTMLAnchorElement | null;

  try {
    const res = (await chrome.runtime.sendMessage({
      type: 'GET_CONFIG',
    })) as ExtensionResponse<ExtensionConfig>;

    if (res && res.success && res.data) {
      currentConfig = res.data;
    }
  } catch {
    currentConfig = DEFAULT_CONFIG;
  }

  if (apiUrlInput) apiUrlInput.value = currentConfig.apiUrl;
  if (webUrlInput) webUrlInput.value = currentConfig.webUrl;
  if (webLink) webLink.href = currentConfig.webUrl;
}

async function checkApiHealth(): Promise<void> {
  const statusDot = document.getElementById('api-status-dot');
  const statusText = document.getElementById('api-status-text');

  if (!statusDot || !statusText) return;

  statusDot.className = 'status-dot status-unknown';
  statusText.textContent = 'Comprobando API...';

  try {
    const res = (await chrome.runtime.sendMessage({
      type: 'CHECK_HEALTH',
    })) as ExtensionResponse<{ healthy: boolean }>;

    if (res && res.data?.healthy) {
      statusDot.className = 'status-dot status-online';
      statusText.textContent = 'API Conectada';
    } else {
      statusDot.className = 'status-dot status-offline';
      statusText.textContent = 'API Desconectada';
    }
  } catch {
    statusDot.className = 'status-dot status-offline';
    statusText.textContent = 'API No disponible';
  }
}

function setupEventListeners(): void {
  // Settings toggle
  const toggleBtn = document.getElementById('settings-toggle');
  const toggleIcon = document.getElementById('settings-toggle-icon');
  const settingsContent = document.getElementById('settings-content');

  if (toggleBtn && toggleIcon && settingsContent) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = settingsContent.classList.toggle('hidden');
      if (isHidden) {
        toggleIcon.classList.remove('open');
      } else {
        toggleIcon.classList.add('open');
      }
    });
  }

  // Settings form
  const settingsForm = document.getElementById('settings-form');
  const feedbackMsg = document.getElementById('settings-feedback');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const apiUrlInput = document.getElementById('api-url') as HTMLInputElement | null;
      const webUrlInput = document.getElementById('web-url') as HTMLInputElement | null;

      if (!apiUrlInput || !webUrlInput) return;

      const newApiUrl = apiUrlInput.value.trim();
      const newWebUrl = webUrlInput.value.trim();

      try {
        const res = (await chrome.runtime.sendMessage({
          type: 'SET_CONFIG',
          payload: { apiUrl: newApiUrl, webUrl: newWebUrl },
        })) as ExtensionResponse<ExtensionConfig>;

        if (res && res.success && res.data) {
          currentConfig = res.data;
          if (feedbackMsg) {
            feedbackMsg.classList.remove('hidden');
            setTimeout(() => feedbackMsg.classList.add('hidden'), 2500);
          }
          await checkApiHealth();
        }
      } catch {
        alert('Error al guardar la configuración.');
      }
    });
  }

  // Presets
  const btnLocal = document.getElementById('btn-preset-local');
  const btnCloud = document.getElementById('btn-preset-cloud');
  const apiUrlInput = document.getElementById('api-url') as HTMLInputElement | null;
  const webUrlInput = document.getElementById('web-url') as HTMLInputElement | null;

  if (btnLocal && apiUrlInput && webUrlInput) {
    btnLocal.addEventListener('click', () => {
      apiUrlInput.value = DEFAULT_CONFIG.apiUrl;
      webUrlInput.value = DEFAULT_CONFIG.webUrl;
    });
  }

  if (btnCloud && apiUrlInput && webUrlInput) {
    btnCloud.addEventListener('click', () => {
      apiUrlInput.value = PRODUCTION_CONFIG.apiUrl;
      webUrlInput.value = PRODUCTION_CONFIG.webUrl;
    });
  }

  // Quick search form
  const searchForm = document.getElementById('search-form');
  const refcatInput = document.getElementById('search-refcat') as HTMLInputElement | null;
  if (searchForm && refcatInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = refcatInput.value.trim().toUpperCase();
      if (!val) return;

      const targetUrl = `${currentConfig.webUrl.replace(/\/+$/, '')}/audit?refcat=${encodeURIComponent(val)}`;
      chrome.tabs.create({ url: targetUrl });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPopup().catch((err) => console.error('Popup init failed:', err));
});
