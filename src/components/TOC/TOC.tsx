import { useState } from 'react';
import { Heading } from '../../types';
import './TOC.css';

interface TOCProps {
  headings: Heading[];
}

export function TOC({ headings }: TOCProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (headings.length === 0) {
    return (
      <div className="toc-empty">
        No headings found
      </div>
    );
  }

  const handleClick = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`TOC navigation: element with id "${id}" not found in DOM`);
    }
  };

  // Find the minimum heading level to normalize indentation
  const minLevel = Math.min(...headings.map(h => h.level));

  return (
    <nav className="toc" aria-label="Table of Contents">
      {headings.map((heading, index) => (
        <button
          key={`${heading.id}-${index}`}
          className={`toc-item toc-level-${heading.level - minLevel} ${activeId === heading.id ? 'toc-active' : ''}`}
          onClick={() => handleClick(heading.id)}
          title={heading.text}
        >
          {heading.text}
        </button>
      ))}
    </nav>
  );
}
