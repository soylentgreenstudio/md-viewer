import { load } from '@tauri-apps/plugin-store';
import { STORE_FILE } from './constants';

// Module-level singleton — one Store instance for the entire app
let storePromise: ReturnType<typeof load> | null = null;

export function getStore() {
  if (!storePromise) {
    storePromise = load(STORE_FILE, { defaults: {}, autoSave: true });
  }
  return storePromise;
}
