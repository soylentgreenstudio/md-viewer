import GithubSlugger from 'github-slugger';
import { Heading } from '../types';

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown.split('\n');
  let inCodeBlock = false;
  const slugger = new GithubSlugger();

  for (const line of lines) {
    // Track code blocks to skip headings inside them
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2]
        .replace(/\*\*(.+?)\*\*/g, '$1')    // bold
        .replace(/\*(.+?)\*/g, '$1')        // italic
        .replace(/`(.+?)`/g, '$1')          // inline code
        .replace(/\[(.+?)\]\(.*?\)/g, '$1') // links
        .trim();

      headings.push({
        level,
        text,
        id: slugger.slug(text),
      });
    }
  }

  return headings;
}

export function getFileName(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1] || filePath;
}

export function isMarkdownFile(path: string): boolean {
  const lower = path.toLowerCase();
  return lower.endsWith('.md') || lower.endsWith('.markdown');
}
