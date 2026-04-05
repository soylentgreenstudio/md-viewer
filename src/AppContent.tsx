import { useEffect, useRef } from 'react';
import { useAppContext } from './contexts/AppContext';
import { useFileOpen } from './hooks/useFileOpen';
import { useTauriDragDrop } from './hooks/useTauriDragDrop';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useRecentFiles } from './hooks/useRecentFiles';
import { Layout } from './components/Layout/Layout';
import { WelcomeScreen } from './components/WelcomeScreen/WelcomeScreen';
import { DropZoneOverlay } from './components/DropZoneOverlay/DropZoneOverlay';

export function AppContent() {
  const { state } = useAppContext();
  const { addRecentFile } = useRecentFiles();

  // Activate hooks
  useFileOpen();
  useTauriDragDrop();
  useKeyboardShortcuts();

  // Track filePath changes to add to recent files
  const prevFilePathRef = useRef<string | null>(null);
  useEffect(() => {
    if (state.filePath && state.filePath !== prevFilePathRef.current) {
      prevFilePathRef.current = state.filePath;
      addRecentFile(state.filePath);
    }
  }, [state.filePath, addRecentFile]);

  // Update window title when file changes
  useEffect(() => {
    if (state.fileName) {
      document.title = `${state.fileName} — MdViewer`;
    } else {
      document.title = 'MdViewer';
    }
  }, [state.fileName]);

  return (
    <>
      {state.content ? <Layout /> : <WelcomeScreen />}
      <DropZoneOverlay />
      {state.isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}
      {state.error && !state.content && (
        <div className="error-message">
          <p>Failed to open file: {state.error}</p>
        </div>
      )}
    </>
  );
}
