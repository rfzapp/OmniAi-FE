import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

const BUNDLED_LANGS = [
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "bash",
  "shell",
  "python",
  "css",
  "html",
  "markdown",
  "yaml",
  "sql",
  "go",
  "rust",
  "java",
];

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: BUNDLED_LANGS,
    });
  }
  return highlighterPromise;
}

export function normalizeLang(lang: string | undefined): string {
  if (!lang) return "text";
  if (lang === "sh") return "bash";
  if (lang === "js") return "javascript";
  if (lang === "ts") return "typescript";
  if (lang === "py") return "python";
  return lang;
}
