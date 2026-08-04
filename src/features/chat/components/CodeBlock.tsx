"use client";

import { useEffect, useState } from "react";
import { getHighlighter, normalizeLang } from "@/lib/markdown";
import { CopyButton } from "@/components/molecules/CopyButton";

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export function CodeBlock({ code, lang }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const language = normalizeLang(lang);

  useEffect(() => {
    let active = true;
    void getHighlighter().then((highlighter) => {
      if (!active) return;
      const knownLangs = highlighter.getLoadedLanguages();
      const safeLang = knownLangs.includes(language) ? language : "text";
      setHtml(
        highlighter.codeToHtml(code, {
          lang: safeLang,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
        })
      );
    });
    return () => {
      active = false;
    };
  }, [code, language]);

  return (
    <div className="group/code relative my-2 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between bg-surface-1 px-3 py-1.5 text-xs text-muted-foreground">
        <span className="font-mono">{language}</span>
        <CopyButton text={code} showTooltip={false} className="opacity-0 group-hover/code:opacity-100" />
      </div>
      {html ? (
        <div
          className="max-w-full overflow-x-auto text-xs [&_pre]:p-3.5 [&_pre]:!bg-surface-0 md:text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="max-w-full overflow-x-auto bg-surface-0 p-3.5 text-xs md:text-sm">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
