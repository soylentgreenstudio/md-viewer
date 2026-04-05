import { useAppContext } from '../../contexts/AppContext';
import { Toolbar } from '../Toolbar/Toolbar';
import { Sidebar } from '../Sidebar/Sidebar';
import { MarkdownViewer } from '../MarkdownViewer/MarkdownViewer';
import { SearchBar } from '../SearchBar/SearchBar';
import './Layout.css';

export function Layout() {
  const { state } = useAppContext();

  return (
    <div className={`layout ${state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Toolbar />
      <div className="layout-body">
        <Sidebar />
        <main
          className="layout-content"
          id="markdown-content"
          style={state.fontSize !== 16 ? { fontSize: `${state.fontSize}px` } : undefined}
        >
          {state.content && state.filePath && (
            <MarkdownViewer content={state.content} filePath={state.filePath} />
          )}
        </main>
      </div>
      {state.searchVisible && <SearchBar />}
    </div>
  );
}
