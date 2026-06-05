"use client";

interface IframeContainerProps {
  generatedHtml: string;
}

export function IframeContainer({ generatedHtml }: IframeContainerProps) {
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
          srcDoc={generatedHtml}
          className="w-full h-[calc(100%-2.25rem)] border-0"
        />
      </div>
    </div>
  );
}
