"use client";

import { Sparkles, Play, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeys } from "@/providers/keys-provider";
import Link from "next/link";

export default function AIShortsPage() {
  const keys = useKeys();
  const missing = !keys.falKey || !keys.elevenLabsKey;

  if (missing) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center animate-fade-in">
        <Sparkles size={40} className="text-text-muted mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">AI Shorts</h1>
        <p className="text-text-muted mb-2">Generate UGC-style marketing videos with AI actors.</p>
        <p className="text-sm text-text-muted mb-8">
          {!keys.falKey && "fal.ai API key required. "}
          {!keys.elevenLabsKey && "ElevenLabs API key required."}
        </p>
        <Link href="/dashboard/settings"><Button>Go to Settings</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Shorts</h1>
        <p className="text-text-muted">Describe your product or paste a URL. AI generates a marketing video with an AI actor, lip-sync, and voiceover.</p>
      </div>

      <div className="space-y-6">
        <Input placeholder="Describe your product or paste a URL..." />
        <Button className="w-full" size="lg">
          <Sparkles size={16} /> Generate AI Short
        </Button>
      </div>

      <div className="mt-16 grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-lg border border-border bg-surface">
          <Play size={20} className="text-foreground mb-3" />
          <h3 className="font-semibold text-sm mb-1">AI Actor</h3>
          <p className="text-xs text-text-muted">Realistic AI-generated human presenter with lip-sync.</p>
        </div>
        <div className="p-5 rounded-lg border border-border bg-surface">
          <Upload size={20} className="text-foreground mb-3" />
          <h3 className="font-semibold text-sm mb-1">Auto-Publish</h3>
          <p className="text-xs text-text-muted">One-click publish to TikTok, Reels, and YouTube Shorts.</p>
        </div>
      </div>
    </div>
  );
}
