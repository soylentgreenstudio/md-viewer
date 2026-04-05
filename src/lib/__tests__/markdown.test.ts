import { describe, it, expect } from 'vitest';
import { extractHeadings, getFileName, isMarkdownFile } from '../markdown';

describe('extractHeadings', () => {
  it('extracts basic headings', () => {
    const md = '# Title\n## Subtitle\n### Sub-sub';
    const headings = extractHeadings(md);
    expect(headings).toHaveLength(3);
    expect(headings[0]).toEqual({ level: 1, text: 'Title', id: 'title' });
    expect(headings[1]).toEqual({ level: 2, text: 'Subtitle', id: 'subtitle' });
    expect(headings[2]).toEqual({ level: 3, text: 'Sub-sub', id: 'sub-sub' });
  });

  it('skips headings inside backtick code blocks', () => {
    const md = '# Real\n```\n# Fake\n```\n## Also Real';
    const headings = extractHeadings(md);
    expect(headings).toHaveLength(2);
    expect(headings[0].text).toBe('Real');
    expect(headings[1].text).toBe('Also Real');
  });

  it('skips headings inside tilde code blocks', () => {
    const md = '# Real\n~~~\n# Fake\n~~~\n## Also Real';
    const headings = extractHeadings(md);
    expect(headings).toHaveLength(2);
  });

  it('strips bold formatting', () => {
    const md = '# **Bold Title**';
    expect(extractHeadings(md)[0].text).toBe('Bold Title');
  });

  it('strips italic formatting', () => {
    const md = '# *Italic Title*';
    expect(extractHeadings(md)[0].text).toBe('Italic Title');
  });

  it('strips inline code', () => {
    const md = '# Title with `code`';
    expect(extractHeadings(md)[0].text).toBe('Title with code');
  });

  it('strips links', () => {
    const md = '# [Link Text](http://example.com)';
    expect(extractHeadings(md)[0].text).toBe('Link Text');
  });

  it('strips strikethrough', () => {
    const md = '# ~~Deleted~~ Text';
    expect(extractHeadings(md)[0].text).toBe('Deleted Text');
  });

  it('returns empty array for no headings', () => {
    expect(extractHeadings('No headings here')).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(extractHeadings('')).toEqual([]);
  });

  it('ignores lines without space after #', () => {
    const md = '#NoSpace\n# With Space';
    const headings = extractHeadings(md);
    expect(headings).toHaveLength(1);
    expect(headings[0].text).toBe('With Space');
  });

  it('handles all 6 heading levels', () => {
    const md = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
    const headings = extractHeadings(md);
    expect(headings).toHaveLength(6);
    headings.forEach((h, i) => expect(h.level).toBe(i + 1));
  });

  it('generates unique slugs for duplicate headings', () => {
    const md = '# Title\n# Title\n# Title';
    const headings = extractHeadings(md);
    expect(headings[0].id).toBe('title');
    expect(headings[1].id).toBe('title-1');
    expect(headings[2].id).toBe('title-2');
  });
});

describe('getFileName', () => {
  it('extracts filename from Unix path', () => {
    expect(getFileName('/home/user/docs/file.md')).toBe('file.md');
  });

  it('extracts filename from Windows path', () => {
    expect(getFileName('C:\\Users\\user\\docs\\file.md')).toBe('file.md');
  });

  it('returns input when no separators', () => {
    expect(getFileName('file.md')).toBe('file.md');
  });

  it('handles mixed separators', () => {
    expect(getFileName('C:\\Users/docs/file.md')).toBe('file.md');
  });
});

describe('isMarkdownFile', () => {
  it('accepts .md files', () => {
    expect(isMarkdownFile('readme.md')).toBe(true);
  });

  it('accepts .markdown files', () => {
    expect(isMarkdownFile('readme.markdown')).toBe(true);
  });

  it('is case insensitive', () => {
    expect(isMarkdownFile('README.MD')).toBe(true);
    expect(isMarkdownFile('file.Markdown')).toBe(true);
  });

  it('rejects non-markdown files', () => {
    expect(isMarkdownFile('file.txt')).toBe(false);
    expect(isMarkdownFile('file.html')).toBe(false);
  });

  it('rejects files without extension', () => {
    expect(isMarkdownFile('noext')).toBe(false);
  });
});
