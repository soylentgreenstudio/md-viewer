import { useAppContext } from '../../contexts/AppContext';
import './DropZoneOverlay.css';

export function DropZoneOverlay() {
  const { state } = useAppContext();

  if (!state.isDragOver) return null;

  return (
    <div className="dropzone-overlay">
      <div className="dropzone-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <polyline points="9 15 12 12 15 15" />
        </svg>
        <span className="dropzone-text">Drop .md file here</span>
      </div>
    </div>
  );
}
