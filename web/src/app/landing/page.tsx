"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Zap, Shield, ArrowRight, Scissors, Subtitles } from "lucide-react";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "AI Clip Detection",
    text: "Gemini 3.0 Flash finds the most engaging moments in your long-form video automatically.",
  },
  {
    icon: Scissors,
    title: "Smart 9:16 Cropping",
    text: "Dual-mode AI reframing with subject tracking or blurred backgrounds.",
  },
  {
    icon: Subtitles,
    title: "Auto Subtitles",
    text: "faster-whisper with word-level timestamps. Burned-in captions styled for retention.",
  },
  {
    icon: Shield,
    title: "Self-Hosted",
    text: "Your videos never leave your infrastructure. Keys encrypted client-side.",
  },
];

export default function LandingPage() {
  const router = useRouter();

  const enter = () => {
    store.setSkipLanding(true);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-full flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <div className="max-w-2xl space-y-10">
          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-surface text-xs text-text-muted">
              <Zap size={12} className="text-foreground" />
              AI-Powered Video Platform
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-none">
              Create viral
              <br />
              shorts with AI
            </h1>
            <p className="text-lg text-text-muted max-w-lg mx-auto leading-relaxed">
              Virlo transforms long-form video into viral 9:16 shorts.
              AI detection, smart reframing, subtitles, and one-click
              publishing.
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button size="lg" onClick={enter}>
              Launch App
              <ArrowRight size={16} />
            </Button>
            <a
              href="https://github.com/mutonby/openshorts"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 pb-32 max-w-4xl mx-auto w-full">
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-lg border border-border bg-surface"
            >
              <f.icon size={22} className="text-foreground mb-4" />
              <h3 className="font-semibold text-sm text-foreground mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-border px-6 py-6 text-center">
        <p className="text-xs text-text-muted">
          Virlo is open source.{" "}
          <a
            href="https://github.com/mutonby/openshorts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline transition-colors"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
