import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useAppContext } from '../contexts/AppContext';
import { isMarkdownFile } from '../lib/markdown';

interface DragDropPayload {
  paths: string[];
  position: { x: number; y: number };
}

export function useTauriDragDrop() {
  const { dispatch, openFile } = useAppContext();

  useEffect(() => {
    // File dropped onto the window — open the first markdown file found
    const unlistenDrop = listen<DragDropPayload>('tauri://drag-drop', async (event) => {
      dispatch({ type: 'SET_DRAG_OVER', payload: false });
      const { paths } = event.payload;
      if (paths && paths.length > 0) {
        const mdFile = paths.find(p => isMarkdownFile(p));
        if (mdFile) {
          await openFile(mdFile);
        }
      }
    });

    // File drag enters the window area — show overlay
    const unlistenEnter = listen('tauri://drag-enter', () => {
      dispatch({ type: 'SET_DRAG_OVER', payload: true });
    });

    // File drag leaves the window area — hide overlay
    const unlistenLeave = listen('tauri://drag-leave', () => {
      dispatch({ type: 'SET_DRAG_OVER', payload: false });
    });

    return () => {
      unlistenDrop.then(fn => fn()).catch(() => {});
      unlistenEnter.then(fn => fn()).catch(() => {});
      unlistenLeave.then(fn => fn()).catch(() => {});
    };
  }, [dispatch, openFile]);
}
