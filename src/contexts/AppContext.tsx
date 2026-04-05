import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { Dispatch } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { AppState, AppAction } from '../types';
import { extractHeadings, getFileName } from '../lib/markdown';

export const initialState: AppState = {
  filePath: null,
  fileName: null,
  content: null,
  headings: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  searchVisible: false,
  recentFiles: [],
  isDragOver: false,
  sidebarCollapsed: false,
  fontSize: 16,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_FILE':
      return {
        ...state,
        isLoading: false,
        error: null,
        filePath: action.payload.filePath,
        fileName: action.payload.fileName,
        content: action.payload.content,
        headings: action.payload.headings,
      };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_FILE':
      return {
        ...state,
        filePath: null,
        fileName: null,
        content: null,
        headings: [],
        error: null,
        searchVisible: false,
        searchQuery: '',
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_SEARCH':
      return {
        ...state,
        searchVisible: !state.searchVisible,
        searchQuery: state.searchVisible ? '' : state.searchQuery,
      };
    case 'CLOSE_SEARCH':
      return { ...state, searchVisible: false, searchQuery: '' };
    case 'SET_RECENT_FILES':
      return { ...state, recentFiles: action.payload };
    case 'SET_DRAG_OVER':
      return { ...state, isDragOver: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'ZOOM_IN':
      return { ...state, fontSize: Math.min(state.fontSize + 2, 32) };
    case 'ZOOM_OUT':
      return { ...state, fontSize: Math.max(state.fontSize - 2, 10) };
    case 'ZOOM_RESET':
      return { ...state, fontSize: 16 };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  openFile: (path: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const openFile = useCallback(async (path: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const content = await invoke<string>('read_markdown_file', { path });
      const headings = extractHeadings(content);
      const fileName = getFileName(path);
      dispatch({
        type: 'SET_FILE',
        payload: { filePath: path, fileName, content, headings },
      });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: String(err) });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, openFile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}
