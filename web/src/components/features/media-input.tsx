"use client";

import { useState, useRef, type DragEvent } from "react";
import { Upload, Video, Link as LinkIcon, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface MediaInputProps {
  onProcess: (data: {
    type: "url" | "file";
    payload: string | File;
    acknowledged?: boolean;
    cropStyle?: string;
  }) => void;
  isProcessing: boolean;
  missingKeys: boolean;
}

export function MediaInput({ onProcess, isProcessing, missingKeys }: MediaInputProps) {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [url, setUrl] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (mode === "url" && url.trim()) {
      onProcess({ type: "url", payload: url.trim(), acknowledged, cropStyle: "blur_bars" });
      setUrl("");
    }
  };

  const handleFile = (file: File) => {
    onProcess({ type: "file", payload: file, acknowledged, cropStyle: "blur_bars" });
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      handleFile(file);
    }
  };

  if (missingKeys) {
    return (
      <div className="rounded-lg border border-warning/30 bg-warning-muted p-6 text-center">
        <AlertTriangle size={24} className="text-warning mx-auto mb-3" />
        <h3 className="font-semibold text-warning mb-2">API Keys Required</h3>
        <p className="text-sm text-text-muted mb-4">
          Set your Gemini and Upload-Post API keys to start creating viral shorts.
        </p>
        <Link href="/dashboard/settings">
          <Button variant="default">Go to Settings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors duration-150 ${
            mode === "url"
              ? "bg-bg-alt text-text"
              : "text-text-muted hover:text-text"
          }`}
        >
          <LinkIcon size={16} /> URL
        </button>
        <button
          onClick={() => setMode("file")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors duration-150 border-l border-border ${
            mode === "file"
              ? "bg-bg-alt text-text"
              : "text-text-muted hover:text-text"
          }`}
        >
          <FileVideo size={16} /> Upload
        </button>
      </div>

      {mode === "url" ? (
        <div className="space-y-3">
          <Input
            placeholder="Paste YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isProcessing || !url.trim()}
          >
            <Video size={16} />
            Generate Clips
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-12 text-center transition-colors duration-150 cursor-pointer ${
            dragOver
              ? "border-accent bg-accent-muted"
              : "border-border hover:border-text-muted"
          }`}
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-muted mb-1">
            Drop your video here or click to browse
          </p>
          <p className="text-xs text-text-subtle">
            MP4, MOV up to 2GB
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {/* Acknowledgment */}
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-1 rounded border-border text-accent focus:ring-accent"
        />
        <span className="text-xs text-text-muted leading-relaxed">
          I have the rights to use this content. Virlo does not store or
          redistribute videos.
        </span>
      </label>
    </div>
  );
}
