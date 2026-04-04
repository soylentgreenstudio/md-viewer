import { useAppContext } from '../../contexts/AppContext';
import { open } from '@tauri-apps/plugin-dialog';
import { getFileName } from '../../lib/markdown';
import './WelcomeScreen.css';

export function WelcomeScreen() {
  const { state, openFile } = useAppContext();

  const handleOpen = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
    });
    if (selected) {
      await openFile(selected as string);
    }
  };

  const handleRecentClick = async (path: string) => {
    await openFile(path);
  };

  return (
    <div className="welcome">
      <div className="welcome-content">
        <div className="welcome-logo">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13h2l1-2 2 4 1-2h2" />
          </svg>
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
                    onClick={() => handleRecentClick(filePath)}
                    title={filePath}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
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
