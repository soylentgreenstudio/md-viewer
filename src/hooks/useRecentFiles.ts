import { useEffect, useCallback } from 'react';
import { exists } from '@tauri-apps/plugin-fs';
import { useAppContext } from '../contexts/AppContext';
import { MAX_RECENT_FILES, STORE_KEY_RECENT } from '../lib/constants';
import { getStore } from '../lib/store';

export function useRecentFiles() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const loadRecentFiles = async () => {
      try {
        const store = await getStore();
        const files = await store.get<string[]>(STORE_KEY_RECENT);
        if (files && Array.isArray(files)) {
          // Filter out files that no longer exist on disk
          const checks = await Promise.all(
            files.map(async (f) => ({
              path: f,
              exists: await exists(f).catch(() => false),
            }))
          );
          const validFiles = checks.filter((c) => c.exists).map((c) => c.path);

          // Update store if stale files were removed
          if (validFiles.length < files.length) {
            await store.set(STORE_KEY_RECENT, validFiles);
            await store.save();
          }

          dispatch({ type: 'SET_RECENT_FILES', payload: validFiles });
        }
      } catch (err) {
        console.error('Failed to load recent files:', err);
      }
    };
    loadRecentFiles();
  }, [dispatch]);

  const addRecentFile = useCallback(async (filePath: string) => {
    try {
      const store = await getStore();
      let files = await store.get<string[]>(STORE_KEY_RECENT) || [];

      files = files.filter(f => f !== filePath);
      files.unshift(filePath);

      if (files.length > MAX_RECENT_FILES) {
        files = files.slice(0, MAX_RECENT_FILES);
      }

      await store.set(STORE_KEY_RECENT, files);
      await store.save();
      dispatch({ type: 'SET_RECENT_FILES', payload: files });
    } catch (err) {
      console.error('Failed to save recent file:', err);
    }
  }, [dispatch]);

  return { recentFiles: state.recentFiles, addRecentFile };
}
