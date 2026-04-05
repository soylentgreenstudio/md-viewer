import { useAppContext } from '../../contexts/AppContext';
import { UploadIcon } from '../Icons';
import './DropZoneOverlay.css';

export function DropZoneOverlay() {
  const { state } = useAppContext();

  if (!state.isDragOver) return null;

  return (
    <div className="dropzone-overlay">
      <div className="dropzone-content">
        <UploadIcon />
        <span className="dropzone-text">Drop .md file here</span>
      </div>
    </div>
  );
}
