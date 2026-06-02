"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Sparkles,
  Terminal,
  PlusCircle,
  Bot,
  LayoutGrid,
  Image,
  Settings,
  AlertTriangle,
  KeyRound,
} from "lucide-react";
import { useKeys } from "@/providers/keys-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaInput } from "@/components/features/media-input";
import { ResultCard } from "@/components/features/result-card";
import { pollJob, type JobResult } from "@/lib/api";
import { store } from "@/lib/store";
import Link from "next/link";

type Status = "idle" | "processing" | "complete" | "error";

const quickLinks = [
  { href: "/dashboard/ai-shorts", label: "AI Shorts", icon: Sparkles },
  { href: "/dashboard/ai-agent", label: "AI Agent", icon: Bot },
  { href: "/dashboard/ugc-gallery", label: "Gallery", icon: LayoutGrid },
  { href: "/dashboard/studio", label: "Studio", icon: Image },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardPage() {
  const keys = useKeys();
  const [status, setStatus] = useState<Status>(() => {
    const s = store.getSession();
    if (s?.status && s.status !== "idle") return s.status;
    return "idle";
  });
  const [jobId, setJobId] = useState<string | null>(() => store.getSession()?.jobId || null);
  const [results, setResults] = useState<JobResult["result"] | null>(() => store.getSession()?.results || null);
  const [logs, setLogs] = useState<string[]>([]);
  const [logsVisible, setLogsVisible] = useState(true);

  const handleProcess = useCallback(
    async (data: { type: "url" | "file"; payload: string | File; acknowledged?: boolean }) => {
      setStatus("processing");
      setLogs(["Starting process..."]);
      setResults(null);
      try {
        if (data.type === "url") {
          const res = await fetch("/api/process", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Gemini-Key": keys.geminiKey },
            body: JSON.stringify({ url: data.payload, acknowledged: !!data.acknowledged, transcription_method: keys.transcriptionMethod, groq_key: keys.groqKey, crop_style: "blur_bars" }),
          });
          if (!res.ok) throw new Error(await res.text());
          setJobId((await res.json()).job_id);
        } else {
          const fd = new FormData();
          fd.append("file", data.payload);
          fd.append("acknowledged", data.acknowledged ? "true" : "false");
          fd.append("transcription_method", keys.transcriptionMethod);
          if (keys.groqKey) fd.append("groq_key", keys.groqKey);
          fd.append("crop_style", "blur_bars");
          const res = await fetch("/api/process", { method: "POST", headers: { "X-Gemini-Key": keys.geminiKey }, body: fd });
          if (!res.ok) throw new Error(await res.text());
          setJobId((await res.json()).job_id);
        }
      } catch (e) {
        setStatus("error");
        setLogs((l) => [...l, `Error: ${(e as Error).message}`]);
      }
    },
    [keys]
  );

  useEffect(() => {
    if (!jobId || (status !== "processing" && status !== "complete")) return;
    const iv = setInterval(async () => {
      try {
        const data = await pollJob(jobId);
        if (data.result) setResults(data.result);
        if (data.status === "completed") { setStatus("complete"); clearInterval(iv); }
        else if (data.status === "failed") { setStatus("error"); setLogs((l) => [...l, "Error: " + (data.error || "Failed")]); clearInterval(iv); }
        if (data.logs) setLogs(data.logs);
      } catch { /* ignore */ }
    }, 2000);
    return () => clearInterval(iv);
  }, [jobId, status]);

  useEffect(() => {
    if (status === "idle") { store.clearSession(); return; }
    store.setSession({ jobId, status, results, timestamp: Date.now() });
  }, [jobId, status, results]);

  const handleReset = () => {
    setStatus("idle"); setJobId(null); setResults(null); setLogs([]);
    store.clearSession();
  };

  const missingKeys = !keys.geminiKey || !keys.uploadPostKey;

  // Processing / Complete / Error states
  if (status !== "idle") {
    return (
      <div className="h-full flex flex-col animate-fade-in">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-bg-alt">
          <div className="flex items-center gap-3">
            <Activity className={status === "processing" ? "animate-pulse text-foreground" : "text-text-muted"} size={18} />
            <span className="text-sm font-medium">
              {status === "processing" ? "Processing..." : status === "complete" ? "Complete" : "Error"}
            </span>
            <Badge variant={status === "complete" ? "success" : status === "error" ? "error" : "accent"}>
              {status.toUpperCase()}
            </Badge>
            {results?.clips?.length ? <Badge variant="default">{results.clips.length} clips</Badge> : null}
            {results?.cost_analysis ? <Badge variant="success">${results.cost_analysis.total_cost?.toFixed(5)}</Badge> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset}><PlusCircle size={16} /> New</Button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Log panel */}
          <div className={`${status === "complete" ? "lg:w-[30%]" : "lg:w-[45%]"} flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-bg-alt p-6 ${status === "complete" ? "lg:opacity-60 hover:opacity-100" : ""} transition-opacity`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono text-text-muted flex items-center gap-2"><Terminal size={14} />Logs</h3>
              <button onClick={() => setLogsVisible(!logsVisible)} className="text-xs text-text-muted hover:text-text">{logsVisible ? "Hide" : "Show"}</button>
            </div>
            {logsVisible && (
              <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1">
                {logs.map((l, i) => (
                  <div key={i} className={l.toLowerCase().includes("error") ? "text-error" : "text-text-muted"}>{l}</div>
                ))}
                {status === "processing" && <div className="animate-pulse text-foreground">_</div>}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex-1 p-6 overflow-y-auto">
            {results?.clips?.length ? (
              <div className={`grid gap-4 ${status === "complete" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
                {results.clips.map((clip, i) => (
                  <ResultCard key={i} clip={clip} index={i} jobId={jobId!} uploadPostKey={keys.uploadPostKey} uploadUserId={keys.uploadUserId} geminiApiKey={keys.geminiKey} elevenLabsKey={keys.elevenLabsKey} onPlay={() => {}} onPause={() => {}} />
                ))}
              </div>
            ) : status === "processing" ? (
              <div className="h-full flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-border border-t-foreground animate-spin" /><span className="ml-3 text-sm text-text-muted">Generating...</span></div>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-text-muted">Generation failed.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Idle dashboard — fresh layout
  return (
    <div className="animate-fade-in">
      {/* Key warning */}
      {missingKeys && (
        <div className="border-b border-border bg-warning-muted px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-warning">
              <AlertTriangle size={14} />
              <KeyRound size={14} />
              <span>API keys needed to generate clips.</span>
            </div>
            <Link href="/dashboard/settings" className="text-xs font-medium px-3 py-1.5 rounded-md border border-warning/30 text-warning hover:bg-warning/10 transition-colors">Set keys</Link>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Hero area */}
        <div className="max-w-xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Clip Generator
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            Drop a long-form video. AI finds the viral moments, crops to 9:16,
            adds subtitles, and prepares for publishing.
          </p>
        </div>

        {/* Upload area */}
        <div className="max-w-lg">
          <MediaInput onProcess={handleProcess} isProcessing={false} missingKeys={missingKeys} />
        </div>

        {/* Quick links — bento style */}
        <div className="mt-24">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-4">Quick Access</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-surface hover:bg-bg-alt transition-colors duration-150 text-center"
              >
                <l.icon size={20} className="text-foreground" />
                <span className="text-xs font-medium text-text-muted">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
