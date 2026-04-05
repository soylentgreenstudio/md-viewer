import { useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useDocumentSearch } from '../../hooks/useDocumentSearch';
import { SearchIcon, ChevronUpIcon, ChevronDownIcon, CloseIcon } from '../Icons';
import './SearchBar.css';

export function SearchBar() {
  const { state, dispatch } = useAppContext();
  const { matchCount, currentMatch, goToNext, goToPrev } = useDocumentSearch();
  const inputRef = useRef<HTMLInputElement>(null);

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
        <SearchIcon size={16} className="search-icon" />
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
        <button className="search-nav-btn" onClick={goToPrev} disabled={matchCount === 0} aria-label="Previous match" title="Previous match (Shift+Enter)">
          <ChevronUpIcon />
        </button>
        <button className="search-nav-btn" onClick={goToNext} disabled={matchCount === 0} aria-label="Next match" title="Next match (Enter)">
          <ChevronDownIcon />
        </button>
        <button className="search-nav-btn search-close-btn" onClick={handleClose} aria-label="Close search" title="Close (Esc)">
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
