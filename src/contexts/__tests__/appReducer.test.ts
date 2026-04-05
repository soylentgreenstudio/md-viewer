import { describe, it, expect } from 'vitest';
import { appReducer, initialState } from '../AppContext';

describe('appReducer', () => {
  it('handles SET_LOADING', () => {
    const state = appReducer(initialState, { type: 'SET_LOADING' });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles SET_FILE', () => {
    const payload = {
      filePath: '/test/file.md',
      fileName: 'file.md',
      content: '# Hello',
      headings: [{ id: 'hello', text: 'Hello', level: 1 }],
    };
    const state = appReducer(initialState, { type: 'SET_FILE', payload });
    expect(state.filePath).toBe('/test/file.md');
    expect(state.fileName).toBe('file.md');
    expect(state.content).toBe('# Hello');
    expect(state.headings).toEqual(payload.headings);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('handles SET_ERROR', () => {
    const state = appReducer(initialState, { type: 'SET_ERROR', payload: 'File not found' });
    expect(state.error).toBe('File not found');
    expect(state.isLoading).toBe(false);
  });

  it('handles CLEAR_FILE', () => {
    const loaded = {
      ...initialState,
      filePath: '/test/file.md',
      content: '# Hello',
      searchVisible: true,
      searchQuery: 'test',
    };
    const state = appReducer(loaded, { type: 'CLEAR_FILE' });
    expect(state.filePath).toBeNull();
    expect(state.content).toBeNull();
    expect(state.headings).toEqual([]);
    expect(state.searchVisible).toBe(false);
    expect(state.searchQuery).toBe('');
  });

  it('handles SET_SEARCH_QUERY', () => {
    const state = appReducer(initialState, { type: 'SET_SEARCH_QUERY', payload: 'test' });
    expect(state.searchQuery).toBe('test');
  });

  it('handles TOGGLE_SEARCH — opens', () => {
    const state = appReducer(initialState, { type: 'TOGGLE_SEARCH' });
    expect(state.searchVisible).toBe(true);
  });

  it('handles TOGGLE_SEARCH — closes and clears query', () => {
    const open = { ...initialState, searchVisible: true, searchQuery: 'test' };
    const state = appReducer(open, { type: 'TOGGLE_SEARCH' });
    expect(state.searchVisible).toBe(false);
    expect(state.searchQuery).toBe('');
  });

  it('handles CLOSE_SEARCH', () => {
    const open = { ...initialState, searchVisible: true, searchQuery: 'test' };
    const state = appReducer(open, { type: 'CLOSE_SEARCH' });
    expect(state.searchVisible).toBe(false);
    expect(state.searchQuery).toBe('');
  });

  it('handles SET_RECENT_FILES', () => {
    const files = ['/a.md', '/b.md'];
    const state = appReducer(initialState, { type: 'SET_RECENT_FILES', payload: files });
    expect(state.recentFiles).toEqual(files);
  });

  it('handles SET_DRAG_OVER', () => {
    const state = appReducer(initialState, { type: 'SET_DRAG_OVER', payload: true });
    expect(state.isDragOver).toBe(true);
  });

  it('handles TOGGLE_SIDEBAR', () => {
    const state = appReducer(initialState, { type: 'TOGGLE_SIDEBAR' });
    expect(state.sidebarCollapsed).toBe(true);
    const state2 = appReducer(state, { type: 'TOGGLE_SIDEBAR' });
    expect(state2.sidebarCollapsed).toBe(false);
  });

  it('returns same state for unknown action', () => {
    // @ts-expect-error testing unknown action
    const state = appReducer(initialState, { type: 'UNKNOWN' });
    expect(state).toBe(initialState);
  });
});
