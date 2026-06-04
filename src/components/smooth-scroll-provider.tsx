"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

export const SmoothScrollProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Handle all internal anchor clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor?.hash &&
        anchor.origin === window.location.origin &&
        anchor.pathname === window.location.pathname
      ) {
        // Only handle if it's a hash on the current page
        const targetId = anchor.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement || anchor.hash === "#") {
          e.preventDefault();
          lenis.scrollTo(anchor.hash === "#" ? 0 : anchor.hash, {
            offset: -20, // Small offset for better breathing room
            duration: 1.8, // Slightly longer for "even smoother" feel
            easing: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)), // Quint easing
            onComplete: () => {
              if (anchor.hash !== "#") {
                window.history.pushState(null, "", anchor.hash);
              }
            },
          });
        }
      }
    };

    window.addEventListener("click", handleAnchorClick, true);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("click", handleAnchorClick, true);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider;
