"use client";

import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { compressImage } from "@/lib/image-utils";

interface AvatarStepProps {
  profilePic: string | null;
  setProfilePic: (pic: string | null) => void;
}

export function AvatarStep({ profilePic, setProfilePic }: AvatarStepProps) {
  const [isDraggingPic, setIsDraggingPic] = useState(false);
  const picInputRef = useRef<HTMLInputElement>(null);

  const handlePicDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPic(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setProfilePic(compressed);
      } catch (err) {
        console.error("Failed to compress image:", err);
      }
    }
  };

  const handlePicSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setProfilePic(compressed);
      } catch (err) {
        console.error("Failed to compress image:", err);
      }
    }
  };

  return (
    <motion.div
      key="step-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: picker triggers input click */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: picker interactive via input */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingPic(true);
        }}
        onDragLeave={() => setIsDraggingPic(false)}
        onDrop={handlePicDrop}
        onClick={() => picInputRef.current?.click()}
        className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDraggingPic
            ? "border-brand-pink bg-brand-pink/5"
            : "border-border bg-background/25 hover:border-brand-pink/40"
        }`}
      >
        <input
          ref={picInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePicSelection}
        />
        {profilePic ? (
          <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0 border border-border mb-3">
            {/* biome-ignore lint/performance/noImgElement: local user uploaded image data URL */}
            <img
              src={profilePic}
              alt="avatar"
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setProfilePic(null);
              }}
              className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white rounded-none border-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Plus className="h-10 w-10 text-muted-foreground/50 border border-dashed rounded-full p-2 shrink-0 mb-3" />
        )}
        <p className="text-xs font-semibold text-foreground">
          {profilePic
            ? "Profile picture attached"
            : "Click to select avatar photo"}
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
          PNG, JPG or SVG formats supported
        </p>
      </div>
    </motion.div>
  );
}
