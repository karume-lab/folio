"use client";

import { useEffect } from "react";

export function ChangeMetadataTitleOnBlur() {
  useEffect(() => {
    const originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Build your portfolio! 🚀";
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}

export default ChangeMetadataTitleOnBlur;
