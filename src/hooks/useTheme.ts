import { useState, useEffect, useCallback } from 'react';
import { getStore } from '../lib/store';
import { STORE_KEY_THEME } from '../lib/constants';

export type ThemeMode = 'system' | 'light' | 'dark';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  const resolved = mode === 'system' ? getSystemTheme() : mode;
  document.documentElement.setAttribute('data-theme', resolved);
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>('system');

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const store = await getStore();
        const saved = await store.get<ThemeMode>(STORE_KEY_THEME);
        if (saved && ['system', 'light', 'dark'].includes(saved)) {
          setMode(saved);
          applyTheme(saved);
        } else {
          applyTheme('system');
        }
      } catch {
        applyTheme('system');
      }
    };
    loadTheme();
  }, []);

  // Apply theme whenever mode changes
  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  // Listen to system theme changes when in 'system' mode
  useEffect(() => {
    if (mode !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  // Cycle: system → light → dark → system
  const toggleTheme = useCallback(async () => {
    const next: ThemeMode = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system';
    setMode(next);
    try {
      const store = await getStore();
      await store.set(STORE_KEY_THEME, next);
      await store.save();
    } catch {
      // ignore store errors
    }
  }, [mode]);

  return { mode, toggleTheme };
}
