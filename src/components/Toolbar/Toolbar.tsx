import { useAppContext } from '../../contexts/AppContext';
import { open } from '@tauri-apps/plugin-dialog';
import './Toolbar.css';

export function Toolbar() {
  const { state, dispatch, openFile } = useAppContext();

  const handleOpen = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
    });
    if (selected) {
      await openFile(selected as string);
    }
  };

  const handleToggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const handleToggleSearch = () => {
    dispatch({ type: 'TOGGLE_SEARCH' });
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn" onClick={handleToggleSidebar} title="Toggle sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
        <button className="toolbar-btn" onClick={handleOpen} title="Open file">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </button>
        {state.content && (
          <button className="toolbar-btn" onClick={handleToggleSearch} title="Search (Ctrl+F)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        )}
      </div>
      <div className="toolbar-center">
        {state.fileName && (
          <span className="toolbar-filename" title={state.filePath || ''}>
            {state.fileName}
          </span>
        )}
      </div>
      <div className="toolbar-right">
        {/* Spacer for centering */}
      </div>
    </div>
  );
}
