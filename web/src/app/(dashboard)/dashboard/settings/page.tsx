"use client";

import { Shield, Zap, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useKeys } from "@/providers/keys-provider";

export default function SettingsPage() {
  const keys = useKeys();

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Badge variant="success"><Shield size={12} className="mr-1" />Keys encrypted client-side</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Gemini API</h2>
            <Badge variant="warning">Required</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-text-muted">Powers AI analysis and clip generation. Free tier available.</p>
          <Input type="password" value={keys.geminiKey} onChange={(e) => keys.setGeminiKey(e.target.value)} placeholder="Paste your Gemini API key..." />
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-foreground hover:underline">Get API Key →</a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upload-Post (Social)</h2>
            <Badge variant="warning">Required</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-text-muted">Publish to TikTok, Instagram Reels, and YouTube Shorts. Free tier.</p>
          <Input type="password" value={keys.uploadPostKey} onChange={(e) => keys.setUploadPostKey(e.target.value)} placeholder="ey..." />
          <Input value={keys.uploadUserId} onChange={(e) => keys.setUploadUserId(e.target.value)} placeholder="User ID (optional)" />
          <div className="grid grid-cols-3 gap-2 text-xs">
            <a href="https://app.upload-post.com/login" target="_blank" rel="noopener noreferrer" className="p-2 rounded border border-border hover:bg-bg-alt transition-colors text-foreground text-center">Login</a>
            <a href="https://app.upload-post.com/manage-users" target="_blank" rel="noopener noreferrer" className="p-2 rounded border border-border hover:bg-bg-alt transition-colors text-foreground text-center">Profiles</a>
            <a href="https://app.upload-post.com/api-keys" target="_blank" rel="noopener noreferrer" className="p-2 rounded border border-border hover:bg-bg-alt transition-colors text-foreground text-center">API Key</a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">ElevenLabs (Translation)</h2>
            <Badge variant="default">Optional</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-text-muted">AI voice dubbing in 30+ languages.</p>
          <Input type="password" value={keys.elevenLabsKey} onChange={(e) => keys.setElevenLabsKey(e.target.value)} placeholder="sk_..." />
          <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs text-foreground hover:underline">Get API Key →</a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">fal.ai (AI Actors)</h2>
            <Badge variant="default">Optional</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-text-muted">Generate UGC-style videos with AI actors.</p>
          <Input type="password" value={keys.falKey} onChange={(e) => keys.setFalKey(e.target.value)} placeholder="fal_..." />
          <a href="https://fal.ai/dashboard/keys" target="_blank" rel="noopener noreferrer" className="text-xs text-foreground hover:underline">Get API Key →</a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h2 className="text-lg font-semibold">Transcription</h2></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => keys.setTranscriptionMethod("faster-whisper")} className={`p-4 rounded-lg border transition-colors duration-150 text-left ${keys.transcriptionMethod === "faster-whisper" ? "border-foreground bg-bg-alt" : "border-border hover:border-text-muted"}`}>
              <Cpu size={18} className="mb-2" />
              <span className="font-semibold text-sm">Faster-Whisper</span>
              <p className="text-xs text-text-muted mt-1">Local CPU · Free</p>
            </button>
            <button onClick={() => keys.setTranscriptionMethod("groq")} className={`p-4 rounded-lg border transition-colors duration-150 text-left ${keys.transcriptionMethod === "groq" ? "border-foreground bg-bg-alt" : "border-border hover:border-text-muted"}`}>
              <Zap size={18} className="mb-2" />
              <span className="font-semibold text-sm">Groq</span>
              <p className="text-xs text-text-muted mt-1">Cloud · Fast</p>
            </button>
          </div>
          {keys.transcriptionMethod === "groq" && <Input type="password" value={keys.groqKey} onChange={(e) => keys.setGroqKey(e.target.value)} placeholder="gsk_..." />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Repliz (Alternative)</h2>
            <Badge variant="default">Optional</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-text-muted">Alternative social posting. YouTube, TikTok, Instagram, Facebook, LinkedIn.</p>
          <div className="grid grid-cols-2 gap-3">
            <Input type="password" value={keys.replizAccessKey} onChange={(e) => keys.setReplizAccessKey(e.target.value)} placeholder="Access Key" />
            <Input type="password" value={keys.replizSecretKey} onChange={(e) => keys.setReplizSecretKey(e.target.value)} placeholder="Secret Key" />
          </div>
          <a href="https://repliz.com" target="_blank" rel="noopener noreferrer" className="text-xs text-foreground hover:underline">Get API Keys →</a>
        </CardContent>
      </Card>
    </div>
  );
}
