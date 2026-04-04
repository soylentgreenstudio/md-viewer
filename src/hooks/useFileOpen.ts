import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useAppContext } from '../contexts/AppContext';
import { isMarkdownFile } from '../lib/markdown';

export function useFileOpen() {
  const { openFile } = useAppContext();

  useEffect(() => {
    // Check if a file was passed via CLI argument (file association double-click)
    const checkStartupFile = async () => {
      try {
        const path = await invoke<string | null>('get_startup_file_path');
        if (path && isMarkdownFile(path)) {
          await openFile(path);
        }
      } catch (err) {
        console.error('Failed to check startup file:', err);
      }
    };

    checkStartupFile();

    // Listen for file open events from single-instance plugin.
    // When user double-clicks another .md file while app is already running,
    // Rust forwards the path via this event.
    const unlisten = listen<string>('open-file', async (event) => {
      const path = event.payload;
      if (path && isMarkdownFile(path)) {
        await openFile(path);
      }
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, [openFile]);
}
