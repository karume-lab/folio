"use client";

/**
 * Triggers a mock download of the compiled HTML string.
 */
export function triggerHtmlDownload(htmlContent: string) {
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "portfolio_site.html";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
