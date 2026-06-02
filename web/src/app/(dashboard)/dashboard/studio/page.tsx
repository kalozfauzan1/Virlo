"use client";

import { Image as ImageIcon, FileText, Hash, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeys } from "@/providers/keys-provider";
import Link from "next/link";

export default function StudioPage() {
  const keys = useKeys();

  if (!keys.geminiKey) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center animate-fade-in">
        <ImageIcon size={40} className="text-text-muted mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">YouTube Studio</h1>
        <p className="text-text-muted mb-8">AI-powered thumbnails, viral titles, and descriptions. Requires Gemini API key.</p>
        <Link href="/dashboard/settings"><Button>Go to Settings</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">YouTube Studio</h1>
        <p className="text-text-muted">AI-powered thumbnails, viral titles, and descriptions for your videos.</p>
      </div>

      <div className="space-y-4 mb-16">
        <Input placeholder="Paste YouTube video URL or describe your video..." />
        <div className="grid sm:grid-cols-3 gap-3">
          <Button variant="outline"><ImageIcon size={16} /> Thumbnail</Button>
          <Button variant="outline"><Hash size={16} /> Titles</Button>
          <Button variant="outline"><FileText size={16} /> Description</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-lg border border-border bg-surface">
          <ImageIcon size={20} className="text-foreground mb-3" />
          <h3 className="font-semibold text-sm mb-1">AI Thumbnails</h3>
          <p className="text-xs text-text-muted">Gemini generates eye-catching thumbnail concepts optimized for CTR.</p>
        </div>
        <div className="p-5 rounded-lg border border-border bg-surface">
          <Sparkles size={20} className="text-foreground mb-3" />
          <h3 className="font-semibold text-sm mb-1">Viral Titles</h3>
          <p className="text-xs text-text-muted">AI-crafted titles designed to maximize views and engagement.</p>
        </div>
      </div>
    </div>
  );
}
