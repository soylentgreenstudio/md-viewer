import { useState, useEffect, useRef } from 'react';
import { Heading } from '../../types';
import './TOC.css';

interface TOCProps {
  headings: Heading[];
}

export function TOC({ headings }: TOCProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const scrollContainer = document.querySelector('.layout-content');
    if (!scrollContainer) return;

    const timer = setTimeout(() => {
      observerRef.current?.disconnect();

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          }
        },
        {
          root: scrollContainer,
          rootMargin: '-10% 0px -80% 0px',
          threshold: 0,
        }
      );

      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });

      observerRef.current = observer;
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [headings]);

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
