"use client";

import { useState } from "react";
import {
  Share2,
  Subtitles,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getApiUrl } from "@/lib/api";

interface Clip {
  path: string;
  start: number;
  end: number;
  score: number;
  title?: string;
  thumbnail?: string;
}

interface ResultCardProps {
  clip: Clip;
  index: number;
  jobId: string;
  uploadPostKey: string;
  uploadUserId: string;
  geminiApiKey: string;
  elevenLabsKey: string;
  onPlay: (time: number) => void;
  onPause: () => void;
}

export function ResultCard({
  clip,
  index,
  jobId,
  uploadPostKey,
  uploadUserId,
  geminiApiKey,
  elevenLabsKey,
  onPlay,
  onPause,
}: ResultCardProps) {
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [subtitles, setSubtitles] = useState<string | null>(null);

  const videoUrl = getApiUrl(`/video/${jobId}/${clip.path}`);
  const duration = clip.end - clip.start;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSubtitles = async () => {
    if (subtitles) {
      setShowSubtitles(!showSubtitles);
      return;
    }
    try {
      const res = await fetch(
        getApiUrl(`/api/subtitles/${jobId}/${clip.path}`),
        { headers: { "X-Gemini-Key": geminiApiKey } }
      );
      if (res.ok) {
        const data = await res.json();
        setSubtitles(data.subtitles || data.text || "");
      }
      setShowSubtitles(true);
    } catch {
      //
    }
  };

  const handlePublish = async (platform: string) => {
    if (!uploadPostKey || !uploadUserId) return;
    try {
      await fetch(getApiUrl("/api/publish"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Upload-Post-Key": uploadPostKey,
        },
        body: JSON.stringify({
          user_id: uploadUserId,
          job_id: jobId,
          clip_path: clip.path,
          platform,
          title: clip.title || `Viral Clip #${index + 1}`,
        }),
      });
    } catch {
      //
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Video Preview */}
        <div className="relative rounded overflow-hidden bg-black aspect-[9/16] max-h-[400px] mx-auto">
          <video
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            onPlay={() => onPlay(clip.start)}
            onPause={onPause}
          />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">
              {clip.title || `Clip #${index + 1}`}
            </h3>
            <Badge variant="accent">Score {clip.score?.toFixed(0)}</Badge>
          </div>
          <p className="text-xs text-text-muted">
            {formatTime(clip.start)} — {formatTime(clip.end)} ({Math.round(duration)}s)
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSubtitles}
          >
            <Subtitles size={14} />
            Subtitles
          </Button>
          {elevenLabsKey && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTranslate(!showTranslate)}
            >
              <Languages size={14} />
              Translate
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePublish("tiktok")}
            disabled={!uploadPostKey}
          >
            <Share2 size={14} />
            Publish
          </Button>
        </div>

        {/* Subtitles */}
        {showSubtitles && subtitles && (
          <div className="rounded border border-border bg-bg-alt p-3 text-xs text-text-muted max-h-32 overflow-y-auto">
            {subtitles}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
