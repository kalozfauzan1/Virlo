"use client";

import { Bot, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIAgentPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in">
      <div className="mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-surface text-xs font-medium text-foreground uppercase tracking-wide">
          <Bot size={12} /> Autonomous Skill
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Your Personal Clipping Team</h1>
        <p className="text-text-muted leading-relaxed max-w-xl">
          Drop videos in a folder. AI clippers pick viral moments, edit them,
          and queue for your approval — a 24/7 short-form editing crew on autopilot.
        </p>
      </div>

      <div className="p-4 rounded-lg border border-warning/30 bg-warning-muted mb-12 flex items-start gap-3">
        <Bot size={18} className="text-warning shrink-0 mt-0.5" />
        <div className="text-sm text-warning">
          <p className="font-semibold mb-1">Upload videos in vertical (9:16) format.</p>
          <p className="text-warning/80">The agent does not reframe horizontal footage.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        {[
          { step: "1", title: "Drop your videos", desc: "Put long-form vertical footage in the watched folder." },
          { step: "2", title: "AI clippers work", desc: "Whisper transcribes, Gemini detects, FFmpeg cuts and adds hooks." },
          { step: "3", title: "You validate, it ships", desc: "Approve candidates, skill auto-publishes to TikTok, Reels & YouTube." },
        ].map((s) => (
          <div key={s.step} className="p-5 rounded-lg border border-border bg-surface">
            <div className="w-8 h-8 rounded-md border border-border bg-bg-alt flex items-center justify-center text-xs font-bold text-foreground mb-3">{s.step}</div>
            <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
            <p className="text-xs text-text-muted leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-lg border border-border bg-surface">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <h2 className="text-lg font-bold mb-1">skill-autoshorts</h2>
            <p className="text-sm text-text-muted">The Claude Code skill. Install once, trigger anytime.</p>
          </div>
          <a href="https://github.com/mutonby/skill-autoshorts" target="_blank" rel="noopener noreferrer">
            <Button><ExternalLink size={14} /> View on GitHub</Button>
          </a>
        </div>
        <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-border bg-bg-alt font-mono text-xs text-text-muted">
          <span className="truncate">git clone https://github.com/mutonby/skill-autoshorts</span>
          <button onClick={() => navigator.clipboard.writeText("git clone https://github.com/mutonby/skill-autoshorts")} className="text-text-muted hover:text-foreground shrink-0"><Copy size={14} /></button>
        </div>
      </div>
    </div>
  );
}
