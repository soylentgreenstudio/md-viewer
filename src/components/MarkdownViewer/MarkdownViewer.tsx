import { memo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { convertFileSrc } from '@tauri-apps/api/core';
import 'highlight.js/styles/github.css';
import './MarkdownViewer.css';

interface MarkdownViewerProps {
  content: string;
  filePath: string;
}

export const MarkdownViewer = memo(function MarkdownViewer({ content, filePath }: MarkdownViewerProps) {
  // Get the directory of the current .md file for resolving relative image paths
  const fileDir = filePath.replace(/[/\\][^/\\]+$/, '');

  return (
    <div className="markdown-viewer">
      <div className="markdown-body">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            img({ src, alt, node: _node, ...props }) {
              if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('blob:')) {
                // Resolve relative paths against the .md file's directory
                let absolutePath: string;
                if (/^[a-zA-Z]:[/\\]/.test(src) || src.startsWith('/')) {
                  absolutePath = src;
                } else {
                  absolutePath = `${fileDir}/${src}`.replace(/\\/g, '/');
                }
                const assetUrl = convertFileSrc(absolutePath);
                return <img src={assetUrl} alt={alt ?? ''} loading="lazy" {...props} />;
              }
              return <img src={src} alt={alt ?? ''} loading="lazy" {...props} />;
            },
            a({ href, children, node: _node, ...props }) {
              // External links open in default browser
              if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                  </a>
                );
              }
              return <a href={href} {...props}>{children}</a>;
            },
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
});
