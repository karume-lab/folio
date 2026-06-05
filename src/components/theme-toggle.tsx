"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const iconSize = size === "sm" ? "size-4" : "size-5";
  const buttonSize = size === "sm" ? "size-8" : "size-10";

  return (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-muted hover:scale-110",
            "focus:bg-muted focus:outline-none",
            buttonSize,
            className,
          )}
          aria-label="Toggle theme"
        >
          {mounted ? (
            resolvedTheme === "dark" ? (
              <Sun className={cn(iconSize)} />
            ) : (
              <Moon className={cn(iconSize)} />
            )
          ) : (
            <div
              className={cn(
                iconSize,
                "rounded-full border border-border/40 animate-pulse bg-muted",
              )}
            />
          )}
          <span className="sr-only">Toggle theme</span>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={10}
          className="bg-background/90 text-foreground border border-border backdrop-blur-md px-2.5 py-1 text-xs rounded-md shadow-lg"
        >
          <p className="text-xs font-medium">Toggle Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
