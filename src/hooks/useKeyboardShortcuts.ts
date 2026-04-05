import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

export function useKeyboardShortcuts() {
  const { dispatch } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      switch (e.key) {
        case 'b':
          e.preventDefault();
          dispatch({ type: 'TOGGLE_SIDEBAR' });
          break;
        case '=':
        case '+':
          e.preventDefault();
          dispatch({ type: 'ZOOM_IN' });
          break;
        case '-':
          e.preventDefault();
          dispatch({ type: 'ZOOM_OUT' });
          break;
        case '0':
          e.preventDefault();
          dispatch({ type: 'ZOOM_RESET' });
          break;
        case 'p':
          e.preventDefault();
          window.print();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);
}
