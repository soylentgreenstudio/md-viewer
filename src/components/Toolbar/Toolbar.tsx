import { useAppContext } from '../../contexts/AppContext';
import { open } from '@tauri-apps/plugin-dialog';
import { useTheme } from '../../hooks/useTheme';
import { SidebarIcon, FileIcon, SearchIcon, PrintIcon, SunIcon, MoonIcon, MonitorIcon } from '../Icons';
import './Toolbar.css';

export function Toolbar() {
  const { state, dispatch, openFile } = useAppContext();
  const { mode, toggleTheme } = useTheme();

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
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} aria-label="Toggle sidebar" title="Toggle sidebar (Ctrl+B)">
          <SidebarIcon />
        </button>
        <button className="toolbar-btn" onClick={handleOpen} aria-label="Open file" title="Open file">
          <FileIcon />
        </button>
        {state.content && (
          <button className="toolbar-btn" onClick={() => dispatch({ type: 'TOGGLE_SEARCH' })} aria-label="Search" title="Search (Ctrl+F)">
            <SearchIcon />
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
        {state.content && (
          <button className="toolbar-btn" onClick={() => window.print()} aria-label="Print" title="Print (Ctrl+P)">
            <PrintIcon />
          </button>
        )}
        <button className="toolbar-btn" onClick={toggleTheme} aria-label={`Theme: ${mode}`} title={`Theme: ${mode}`}>
          {mode === 'dark' ? <SunIcon /> : mode === 'light' ? <MoonIcon /> : <MonitorIcon />}
        </button>
      </div>
    </div>
  );
}
