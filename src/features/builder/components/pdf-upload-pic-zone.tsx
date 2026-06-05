"use client";

import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";

interface PdfUploadPicZoneProps {
  profilePic: string | null;
  setProfilePic: (pic: string | null) => void;
}

export function PdfUploadPicZone({
  profilePic,
  setProfilePic,
}: PdfUploadPicZoneProps) {
  const [isDraggingPic, setIsDraggingPic] = useState(false);
  const picInputRef = useRef<HTMLInputElement>(null);

  const handlePicDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPic(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePicSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
        Profile Picture (used as Favicon & Hero Image)
      </Label>
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
        className={`border border-dashed rounded-xl p-4 flex items-center justify-center gap-4 cursor-pointer transition-all duration-300 ${
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
          <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border border-border">
            {/* biome-ignore lint/performance/noImgElement: local user uploaded image data URL */}
            <img
              src={profilePic}
              alt="avatar preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProfilePic(null);
              }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <Plus className="h-8 w-8 text-muted-foreground/50 border border-dashed rounded-full p-1.5 shrink-0" />
        )}
        <div className="text-left">
          <p className="text-xs font-semibold text-foreground">
            {profilePic ? "Avatar ready" : "Upload avatar picture"}
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            Supports PNG, JPG, or SVG
          </p>
        </div>
      </div>
    </div>
  );
}
