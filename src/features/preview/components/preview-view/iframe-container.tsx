"use client";

import { useEffect, useRef, useState } from "react";

interface IframeContainerProps {
  generatedHtml: string;
}

function injectEditScript(html: string): string {
  if (!html) return html;

  const script = `
<script id="folio-edit-script">
  // Prevent links from navigating in preview mode
  document.querySelectorAll('a').forEach(el => {
    el.addEventListener('click', e => e.preventDefault());
  });

  // Make text elements editable
  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'li'];
  tags.forEach(tag => {
    document.querySelectorAll(tag).forEach(el => {
      el.contentEditable = "true";
      el.addEventListener('input', () => {
        // Clone document to strip editing markers before sending
        const clone = document.documentElement.cloneNode(true);
        clone.querySelectorAll('[contenteditable]').forEach(c => c.removeAttribute('contenteditable'));
        const scriptEl = clone.querySelector('#folio-edit-script');
        if (scriptEl) scriptEl.remove();
        
        window.parent.postMessage({
          type: 'HTML_EDITED',
          html: '<!DOCTYPE html>\\n' + clone.outerHTML
        }, '*');
      });
    });
  });
</script>
`;

  if (html.includes("</body>")) {
    return html.replace("</body>", `${script}</body>`);
  }
  return html + script;
}

export function IframeContainer({ generatedHtml }: IframeContainerProps) {
  const [srcDoc, setSrcDoc] = useState(() => injectEditScript(generatedHtml));
  const lastCleanHtmlRef = useRef(generatedHtml);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "HTML_EDITED") {
        lastCleanHtmlRef.current = event.data.html;
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (generatedHtml !== lastCleanHtmlRef.current) {
      lastCleanHtmlRef.current = generatedHtml;
      setSrcDoc(injectEditScript(generatedHtml));
    }
  }, [generatedHtml]);

  return (
    <div className="lg:col-span-8 h-full bg-black/40 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
      <div className="h-full w-full max-w-2xl bg-card border border-border/30 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Mock Browser Chrome Header */}
        <div className="h-9 border-b border-border/20 bg-background/55 px-4 flex items-center justify-between text-[10px] text-muted-foreground/70 shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-gold/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/30" />
          </div>
          <div className="bg-muted/40 border border-border/20 px-4 py-0.5 rounded text-[9px] truncate max-w-40 sm:max-w-xs">
            folio.ai/preview
          </div>
        </div>

        {/* The Live Interactive Sandbox Iframe */}
        <iframe
          title="portfolio-preview"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          className="w-full h-[calc(100%-2.25rem)] border-0"
        />
      </div>
    </div>
  );
}
