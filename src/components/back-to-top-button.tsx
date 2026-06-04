"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const duration = 1200;
    const start = window.scrollY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;

      if (timeElapsed < duration) {
        const progress = timeElapsed / duration;
        const ease =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(0, start * (1 - ease));
        requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, 0);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 rounded-full z-50 size-10 duration-300 animate-in fade-in zoom-in bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 cursor-pointer shadow-lg hover:scale-105 transition-all"
      size="icon"
      aria-label="Scroll to top"
    >
      <ChevronUp className="size-5" />
    </Button>
  );
}

export default BackToTopButton;
