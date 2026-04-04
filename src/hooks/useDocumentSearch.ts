import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

export function useDocumentSearch() {
  const { state, dispatch } = useAppContext();
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const highlightsRef = useRef<HTMLElement[]>([]);

  // Clear all highlights, restoring original text nodes
  const clearHighlights = useCallback(() => {
    const container = document.querySelector('.markdown-body');
    if (!container) return;

    const marks = container.querySelectorAll('mark.search-highlight, mark.search-highlight-active');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize(); // merge adjacent text nodes
      }
    });

    highlightsRef.current = [];
    setMatchCount(0);
    setCurrentMatch(0);
  }, []);

  // Ctrl+F keyboard shortcut and Escape handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_SEARCH' });
      }
      if (e.key === 'Escape' && state.searchVisible) {
        e.preventDefault();
        clearHighlights();
        dispatch({ type: 'CLOSE_SEARCH' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, state.searchVisible, clearHighlights]);

  // Perform search when query or visibility changes
  useEffect(() => {
    if (!state.searchVisible || !state.searchQuery) {
      clearHighlights();
      return;
    }

    const query = state.searchQuery.toLowerCase();
    if (query.length < 2) {
      clearHighlights();
      return;
    }

    clearHighlights();

    const container = document.querySelector('.markdown-body');
    if (!container) return;

    const highlights: HTMLElement[] = [];

    // Use TreeWalker to find text nodes, skipping code/pre/mark elements
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (
            parent &&
            (parent.tagName === 'CODE' ||
              parent.tagName === 'PRE' ||
              parent.tagName === 'MARK')
          ) {
            return NodeFilter.FILTER_SKIP;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    // Process text nodes in reverse to avoid offset issues after DOM mutations
    for (let i = textNodes.length - 1; i >= 0; i--) {
      const textNode = textNodes[i];
      const text = textNode.textContent || '';
      const lowerText = text.toLowerCase();

      const matches: { start: number; end: number }[] = [];

      let searchFrom = 0;
      while (searchFrom < lowerText.length) {
        const idx = lowerText.indexOf(query, searchFrom);
        if (idx === -1) break;
        matches.push({ start: idx, end: idx + query.length });
        searchFrom = idx + 1;
      }

      if (matches.length === 0) continue;

      const parent = textNode.parentNode;
      if (!parent) continue;

      const fragment = document.createDocumentFragment();
      let currentPos = 0;

      for (const match of matches) {
        // Text before match
        if (match.start > currentPos) {
          fragment.appendChild(document.createTextNode(text.slice(currentPos, match.start)));
        }
        // Highlighted match
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = text.slice(match.start, match.end);
        fragment.appendChild(mark);
        highlights.push(mark);
        currentPos = match.end;
      }

      // Remaining text after last match
      if (currentPos < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(currentPos)));
      }

      parent.replaceChild(fragment, textNode);
    }

    // Sort highlights into document order (text nodes were processed in reverse)
    highlights.sort((a, b) => {
      const pos = a.compareDocumentPosition(b);
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    highlightsRef.current = highlights;
    setMatchCount(highlights.length);

    if (highlights.length > 0) {
      setCurrentMatch(1);
      highlights[0].className = 'search-highlight-active';
      highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Return cleanup function — clears highlights when component unmounts
    return () => {
      clearHighlights();
    };
  }, [state.searchQuery, state.searchVisible, state.content, clearHighlights]);

  // Navigate to next match
  const goToNext = useCallback(() => {
    const highlights = highlightsRef.current;
    if (highlights.length === 0) return;

    setCurrentMatch(prev => {
      const prevIdx = prev - 1;
      if (prevIdx >= 0 && prevIdx < highlights.length) {
        highlights[prevIdx].className = 'search-highlight';
      }
      const nextIdx = prev >= highlights.length ? 0 : prev;
      highlights[nextIdx].className = 'search-highlight-active';
      highlights[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return nextIdx + 1;
    });
  }, []);

  // Navigate to previous match
  const goToPrev = useCallback(() => {
    const highlights = highlightsRef.current;
    if (highlights.length === 0) return;

    setCurrentMatch(prev => {
      const prevIdx = prev - 1;
      if (prevIdx >= 0 && prevIdx < highlights.length) {
        highlights[prevIdx].className = 'search-highlight';
      }
      const nextIdx = prev <= 1 ? highlights.length - 1 : prev - 2;
      highlights[nextIdx].className = 'search-highlight-active';
      highlights[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return nextIdx + 1;
    });
  }, []);

  return { matchCount, currentMatch, goToNext, goToPrev };
}
