"use client";

import { RefreshCw, Send } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "@/folio-app/types";

interface IterationBarProps {
  chatHistory: ChatMessage[];
  isRevising: boolean;
  chatInput: string;
  setChatInput: (val: string) => void;
  applyRevision: (userText: string) => void;
}

export function IterationBar({
  chatHistory,
  isRevising,
  chatInput,
  setChatInput,
  applyRevision,
}: IterationBarProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistory.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isRevising) return;
    applyRevision(chatInput.trim());
    setChatInput("");
  };

  return (
    <div className="lg:col-span-4 h-full border-t lg:border-t-0 lg:border-l border-border/30 bg-card/15 flex flex-col justify-between overflow-hidden">
      {/* Chat logs */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pb-1 border-b border-border/10">
          Folio Copilot Revisions
        </div>

        <div className="space-y-3.5">
          {chatHistory.map((chat, idx) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static index is safe
              key={idx}
              className={`flex flex-col gap-1 max-w-[85%] ${
                chat.sender === "user"
                  ? "ml-auto text-right"
                  : "mr-auto text-left"
              }`}
            >
              <span className="text-[9px] font-bold text-muted-foreground uppercase">
                {chat.sender === "user" ? "You" : "Folio Engine"}
              </span>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  chat.sender === "user"
                    ? "bg-brand-purple/20 text-foreground border border-brand-purple/30 rounded-tr-none"
                    : "bg-secondary/40 text-muted-foreground/90 border border-border/30 rounded-tl-none"
                }`}
              >
                {chat.text}
              </div>
            </div>
          ))}

          {isRevising && (
            <div className="flex flex-col gap-1 max-w-[85%] mr-auto text-left">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">
                Folio Engine
              </span>
              <div className="bg-secondary/40 text-muted-foreground/90 border border-border/30 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs">
                <RefreshCw className="h-3.5 w-3.5 text-brand-purple animate-spin" />
                <span>Updating styled templates...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Floating Iteration input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-border/30 bg-card/65 shrink-0"
      >
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="e.g. use a cyberpunk theme, or add AWS skill"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isRevising}
            className="bg-background/40 border-border text-foreground text-xs pr-10 rounded-xl h-10 placeholder:text-muted-foreground/40 focus-visible:ring-brand-purple"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={!chatInput.trim() || isRevising}
            className="absolute right-1 text-muted-foreground hover:text-brand-purple h-8 w-8 cursor-pointer rounded-lg shrink-0 disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-[9px] text-muted-foreground/50 block mt-1.5 text-center">
          Describe prompt updates to live render revision layouts.
        </span>
      </form>
    </div>
  );
}
