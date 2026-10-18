import { ExtensionConfig } from './messages.js';

export const DEFAULT_CONFIG: ExtensionConfig = {
  apiUrl: 'http://localhost:3001',
  webUrl: 'http://localhost:3000',
};

export const PRODUCTION_CONFIG: ExtensionConfig = {
  apiUrl: 'https://openbarrio-api.workers.dev',
  webUrl: 'https://openbarrio-web.pages.dev',
};

const STORAGE_KEY = 'openbarrio_config';

export async function getStoredConfig(): Promise<ExtensionConfig> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    if (result && result[STORAGE_KEY]) {
      return {
        ...DEFAULT_CONFIG,
        ...result[STORAGE_KEY],
      };
    }
  }
  return DEFAULT_CONFIG;
}

export async function setStoredConfig(
  newConfig: Partial<ExtensionConfig>
): Promise<ExtensionConfig> {
  const current = await getStoredConfig();
  const merged: ExtensionConfig = {
    ...current,
    ...newConfig,
  };
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({ [STORAGE_KEY]: merged });
  }
  return merged;
}
