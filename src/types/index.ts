export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface AppState {
  filePath: string | null;
  fileName: string | null;
  content: string | null;
  headings: Heading[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  searchVisible: boolean;
  recentFiles: string[];
  isDragOver: boolean;
  sidebarCollapsed: boolean;
  fontSize: number;
}

export type AppAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_FILE'; payload: { filePath: string; fileName: string; content: string; headings: Heading[] } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_FILE' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'CLOSE_SEARCH' }
  | { type: 'SET_RECENT_FILES'; payload: string[] }
  | { type: 'SET_DRAG_OVER'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'ZOOM_RESET' };
