import { useAppContext } from '../../contexts/AppContext';
import { TOC } from '../TOC/TOC';
import './Sidebar.css';

export function Sidebar() {
  const { state } = useAppContext();

  if (state.sidebarCollapsed) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Contents</span>
      </div>
      <div className="sidebar-content">
        <TOC headings={state.headings} />
      </div>
    </aside>
  );
}
