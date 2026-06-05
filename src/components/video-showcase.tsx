"use client";

import { Monitor, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay when the video section enters the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((err) => {
            console.log("Autoplay blocked or failed:", err);
          });
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the video is visible
      },
    );

    observer.observe(video);

    // Track video time progress
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      observer.unobserve(video);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      ref={containerRef}
      className="relative max-w-5xl mx-auto rounded-2xl border border-border bg-card/60 p-2 shadow-[0_0_50px_rgba(114,78,145,0.15)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_60px_rgba(229,79,109,0.2)]"
    >
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-full bg-brand-purple/10 blur-[80px] pointer-events-none -z-10" />

      {/* Browser Chrome Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 text-xs text-muted-foreground/80">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-destructive/40" />
          <span className="w-3 h-3 rounded-full bg-brand-gold/40" />
          <span className="w-3 h-3 rounded-full bg-success/40" />
        </div>
        <div className="bg-muted/50 px-6 py-1 rounded-md text-muted-foreground border border-border/30 flex items-center gap-1.5 max-w-70 sm:max-w-xs overflow-hidden truncate font-mono text-[10px]">
          <Monitor className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>how-folio-works-demo.mp4</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-purple/15 text-brand-purple border border-brand-purple/20 text-[9px] font-bold">
            DEMO
          </span>
        </div>
      </div>

      {/* Video Content Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/60 group">
        <video
          ref={videoRef}
          src="/folio-demo.mp4"
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Overlay controls */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="w-full flex items-center justify-between gap-4">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer border border-white/10"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>

            {/* Custom Progress Bar */}
            <div className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-linear-to-r from-brand-purple to-brand-pink transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Mute/Unmute Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer border border-white/10"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Muted Autoplay Indicator (top-right corner overlay) */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/75 text-white/90 text-xs font-medium backdrop-blur-md transition-all active:scale-95 cursor-pointer border border-white/5 shadow-md"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-brand-pink" />
                <span>Click to Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-brand-gold" />
                <span>Mute</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
