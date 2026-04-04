import { useEffect, useCallback } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { useAppContext } from '../contexts/AppContext';
import { MAX_RECENT_FILES, STORE_FILE, STORE_KEY_RECENT } from '../lib/constants';

export function useRecentFiles() {
  const { state, dispatch } = useAppContext();

  // Load recent files from store on mount
  useEffect(() => {
    const loadRecentFiles = async () => {
      try {
        const store = await load(STORE_FILE, { defaults: {}, autoSave: true });
        const files = await store.get<string[]>(STORE_KEY_RECENT);
        if (files && Array.isArray(files)) {
          dispatch({ type: 'SET_RECENT_FILES', payload: files });
        }
      } catch (err) {
        console.error('Failed to load recent files:', err);
      }
    };
    loadRecentFiles();
  }, [dispatch]);

  // Add a file to the recent files list, deduplicating and trimming to max length
  const addRecentFile = useCallback(async (filePath: string) => {
    try {
      const store = await load(STORE_FILE, { defaults: {}, autoSave: true });
      let files = await store.get<string[]>(STORE_KEY_RECENT) || [];

      // Remove existing entry for this path, then prepend
      files = files.filter(f => f !== filePath);
      files.unshift(filePath);

      // Trim to max allowed length
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
