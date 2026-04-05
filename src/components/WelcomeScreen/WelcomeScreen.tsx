import { useAppContext } from '../../contexts/AppContext';
import { open } from '@tauri-apps/plugin-dialog';
import { getFileName } from '../../lib/markdown';
import { LogoIcon, FileIcon } from '../Icons';
import './WelcomeScreen.css';

export function WelcomeScreen() {
  const { state, openFile } = useAppContext();

  const handleOpen = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
    });
    if (typeof selected === 'string') {
      await openFile(selected);
    }
  };

  return (
    <div className="welcome">
      <div className="welcome-content">
        <div className="welcome-logo">
          <LogoIcon />
        </div>
        <h1 className="welcome-title">MdViewer</h1>
        <p className="welcome-subtitle">Lightweight Markdown Viewer</p>

        <button className="welcome-open-btn" onClick={handleOpen}>
          Open Markdown File
        </button>

        <p className="welcome-hint">
          or drag &amp; drop a .md file anywhere
        </p>

        {state.recentFiles.length > 0 && (
          <div className="welcome-recent">
            <h3 className="welcome-recent-title">Recent Files</h3>
            <ul className="welcome-recent-list">
              {state.recentFiles.map((filePath, index) => (
                <li key={index}>
                  <button
                    className="welcome-recent-item"
                    onClick={() => openFile(filePath)}
                    title={filePath}
                  >
                    <FileIcon size={16} />
                    <div className="welcome-recent-info">
                      <span className="welcome-recent-name">{getFileName(filePath)}</span>
                      <span className="welcome-recent-path">{filePath}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
