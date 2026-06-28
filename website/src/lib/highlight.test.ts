import { describe, it, expect } from 'vitest';
import { highlightCode } from './highlight.js';

describe('highlightCode', () => {
  it('produces themed token spans for a known language', async () => {
    const html = await highlightCode('const x = 1', 'ts');
    expect(html).toContain('<pre');
    expect(html).toContain('<span style="color');
    expect(html).toContain('const');
  });

  it('falls back to escaped plain text for an unknown language', async () => {
    const html = await highlightCode('a < b && c > d', 'not-a-lang');
    expect(html).toContain('cd-code-plain');
    expect(html).toContain('a &lt; b &amp;&amp; c &gt; d');
    expect(html).not.toContain('<span style="color');
  });
});
