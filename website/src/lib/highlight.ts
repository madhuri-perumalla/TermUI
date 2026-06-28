import { createHighlighter, type Highlighter } from 'shiki';

export const SUPPORTED_LANGS = [
  'typescript', 'tsx', 'javascript', 'jsx', 'bash', 'json', 'css',
] as const;

// Aliases callers may pass.
const LANG_ALIAS: Record<string, string> = {
  ts: 'typescript', js: 'javascript', sh: 'bash', shell: 'bash', zsh: 'bash',
};

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  // Singleton: build the highlighter once per process (per build).
  highlighterPromise ??= createHighlighter({
    themes: ['tokyo-night'],
    langs: [...SUPPORTED_LANGS],
  });
  return highlighterPromise;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Highlight code on the server. Returns ready HTML. Unknown languages and any
 * Shiki failure fall back to escaped plain text so a build can never throw on a
 * surprising snippet.
 */
export async function highlightCode(code: string, lang = 'text'): Promise<string> {
  const resolved = LANG_ALIAS[lang] ?? lang;
  if (!SUPPORTED_LANGS.includes(resolved as (typeof SUPPORTED_LANGS)[number])) {
    return `<pre class="cd-code-plain"><code>${escapeHtml(code)}</code></pre>`;
  }
  try {
    const hl = await getHighlighter();
    return hl.codeToHtml(code, { lang: resolved, theme: 'tokyo-night' });
  } catch {
    return `<pre class="cd-code-plain"><code>${escapeHtml(code)}</code></pre>`;
  }
}
