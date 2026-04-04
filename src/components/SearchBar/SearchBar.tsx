import { useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useDocumentSearch } from '../../hooks/useDocumentSearch';
import './SearchBar.css';

export function SearchBar() {
  const { state, dispatch } = useAppContext();
  const { matchCount, currentMatch, goToNext, goToPrev } = useDocumentSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when search bar appears
  useEffect(() => {
    if (state.searchVisible && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [state.searchVisible]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SEARCH' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search in document..."
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
          onKeyDown={handleKeyDown}
        />
        {state.searchQuery && (
          <span className="search-count">
            {matchCount > 0 ? `${currentMatch} / ${matchCount}` : 'No results'}
          </span>
        )}
      </div>
      <div className="search-nav">
        <button
          className="search-nav-btn"
          onClick={goToPrev}
          disabled={matchCount === 0}
          title="Previous match (Shift+Enter)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <button
          className="search-nav-btn"
          onClick={goToNext}
          disabled={matchCount === 0}
          title="Next match (Enter)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <button
          className="search-nav-btn search-close-btn"
          onClick={handleClose}
          title="Close (Esc)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
