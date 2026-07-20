import React, { useState, useEffect } from 'react';
import { Youtube, Upload, FileVideo, X, Film, Crop, Tag, Shield, ExternalLink, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getApiUrl } from '../config';
import { validateYouTubeCookies } from '../lib/youtubeCookies';

export default function MediaInput({
    onProcess,
    isProcessing,
    youtubeCookiesConfigured = false,
    youtubeCookiesSummary = { lineCount: 0, domainCount: 0, hasCookies: false },
    onSaveYouTubeCookies,
    onRemoveYouTubeCookies
}) {
    const [youtubeUrlEnabled, setYoutubeUrlEnabled] = useState(true);
    const [mode, setMode] = useState('url'); // 'url' | 'file'
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [acknowledged, setAcknowledged] = useState(false);
    const [cropStyle, setCropStyle] = useState('blur_bars'); // 'blur_bars' | 'auto'
    const [category, setCategory] = useState('general'); // 'general' | 'podcast' | ...
    const [showCookieSetup, setShowCookieSetup] = useState(false);
    const [cookieInput, setCookieInput] = useState('');
    const [cookieError, setCookieError] = useState('');
    const [cookieSaved, setCookieSaved] = useState(false);

    useEffect(() => {
        fetch(getApiUrl('/api/config'))
            .then((r) => r.ok ? r.json() : null)
            .then((cfg) => {
                if (cfg && cfg.youtubeUrlEnabled === false) {
                    setYoutubeUrlEnabled(false);
                    setMode('file');
                }
            })
            .catch(() => {});
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!acknowledged) return;
        if (mode === 'url' && url) {
            onProcess({ type: 'url', payload: url, acknowledged: true, cropStyle, category });
        } else if (mode === 'file' && file) {
            onProcess({ type: 'file', payload: file, acknowledged: true, cropStyle, category });
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setMode('file');
        }
    };

    const handleCookieFile = async (selectedFile) => {
        if (!selectedFile) return;
        const text = await selectedFile.text();
        setCookieInput(text);
        setCookieError('');
        setCookieSaved(false);
    };

    const handleSaveCookies = () => {
        const validation = validateYouTubeCookies(cookieInput);
        if (!validation.ok) {
            setCookieError(validation.message);
            setCookieSaved(false);
            return;
        }
        try {
            onSaveYouTubeCookies?.(cookieInput);
            setCookieError('');
            setCookieSaved(true);
            setTimeout(() => {
                setShowCookieSetup(false);
                setCookieInput('');
                setCookieSaved(false);
            }, 900);
        } catch (error) {
            setCookieError(error.message || 'Failed to save YouTube cookies.');
            setCookieSaved(false);
        }
    };

    return (
        <div className="bg-surface border border-white/5 rounded-2xl p-6 animate-[fadeIn_0.6s_ease-out]">
            <div className="flex gap-4 mb-6 border-b border-white/5 pb-4">
                {youtubeUrlEnabled && (
                    <button
                        onClick={() => setMode('url')}
                        className={`flex items-center gap-2 pb-2 px-2 transition-all ${mode === 'url'
                            ? 'text-primary border-b-2 border-primary -mb-[17px]'
                            : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        <Youtube size={18} />
                        YouTube URL
                    </button>
                )}
                <button
                    onClick={() => setMode('file')}
                    className={`flex items-center gap-2 pb-2 px-2 transition-all ${mode === 'file'
                        ? 'text-primary border-b-2 border-primary -mb-[17px]'
                        : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    <Upload size={18} />
                    Upload File
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {mode === 'url' ? (
                    <div className="space-y-4">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="input-field"
                            required
                        />

                        <div className={`rounded-xl border p-4 ${youtubeCookiesConfigured ? 'bg-green-500/5 border-green-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-3">
                                    {youtubeCookiesConfigured ? (
                                        <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
                                    ) : (
                                        <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-white">YouTube Access</div>
                                        <p className="text-xs text-zinc-400 mt-1">
                                            {youtubeCookiesConfigured
                                                ? `Configured in this browser (${youtubeCookiesSummary.lineCount} cookie rows).`
                                                : 'Optional: add your YouTube cookies once if server downloads are blocked.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setShowCookieSetup(true)}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
                                    >
                                        {youtubeCookiesConfigured ? 'Update' : 'Setup'}
                                    </button>
                                    {youtubeCookiesConfigured && (
                                        <button
                                            type="button"
                                            onClick={onRemoveYouTubeCookies}
                                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/15 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${file ? 'border-primary/50 bg-primary/5' : 'border-zinc-700 hover:border-zinc-500 bg-white/5'
                            }`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <div className="flex items-center justify-center gap-3 text-white">
                                <FileVideo className="text-primary" />
                                <span className="font-medium">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="p-1 hover:bg-white/10 rounded-full"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer block">
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                <Upload className="mx-auto mb-3 text-zinc-500" size={24} />
                                <p className="text-zinc-400">Click to upload or drag and drop</p>
                                <p className="text-xs text-zinc-600 mt-1">MP4, MOV up to 500MB</p>
                            </label>
                        )}
                    </div>
                )}

                <div className="mt-5 p-4 bg-white/5 rounded-xl border border-white/5">
                    <label htmlFor="category" className="flex items-center gap-2 text-xs text-zinc-500 mb-3 uppercase tracking-wider">
                        <Tag size={12} />
                        Kategori Konten
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    >
                        <option value="general">Umum (Auto-Detect)</option>
                        <option value="podcast">Podcast / Diskusi</option>
                        <option value="podcast_comedy">Podcast Komedi</option>
                        <option value="tutorial">Tutorial / Edukasi</option>
                        <option value="gaming">Gaming</option>
                        <option value="reaction">Reaksi</option>
                        <option value="interview">Wawancara</option>
                        <option value="news">Berita</option>
                    </select>
                    <p className="text-[10px] text-zinc-600 mt-2">
                        Semua kategori menggunakan multi-pass AI (scout → judge) untuk hasil terbaik.
                        {category === 'general' && ' AI akan mendeteksi jenis konten otomatis.'}
                    </p>
                </div>

                <div className="mt-5 p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">Crop Style</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setCropStyle('blur_bars')}
                            className={`flex-1 flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${cropStyle === 'blur_bars'
                                ? 'bg-primary/20 text-primary border border-primary/40'
                                : 'bg-white/5 text-zinc-400 hover:text-white border border-transparent'
                                }`}
                        >
                            <Film size={16} />
                            <div className="text-left">
                                <div className="font-medium">Blur Bars</div>
                                <div className="text-[10px] opacity-60">Full content, sharp quality</div>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setCropStyle('auto')}
                            className={`flex-1 flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${cropStyle === 'auto'
                                ? 'bg-primary/20 text-primary border border-primary/40'
                                : 'bg-white/5 text-zinc-400 hover:text-white border border-transparent'
                                }`}
                        >
                            <Crop size={16} />
                            <div className="text-left">
                                <div className="font-medium">AI Crop &amp; Track</div>
                                <div className="text-[10px] opacity-60">Smart cropping, follows speaker</div>
                            </div>
                        </button>
                    </div>
                </div>

                <label className="flex items-start gap-2 mt-5 text-xs text-zinc-400 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="mt-0.5 accent-primary cursor-pointer"
                    />
                    <span>
                        I confirm I own this content or have the rights to process it. I am responsible for any content I submit. See our <a href="/#legal" target="_blank" rel="noopener noreferrer" className="text-primary underline" onClick={(e) => e.stopPropagation()}>Terms & Privacy</a>.
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={isProcessing || !acknowledged || (mode === 'url' && !url) || (mode === 'file' && !file)}
                    className="w-full btn-primary mt-4 flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing Video...
                        </>
                    ) : (
                        <>
                            Generate Clips
                        </>
                    )}
                </button>
            </form>

            {showCookieSetup && (
                <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-[#151515] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-primary" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Setup YouTube Access</h3>
                                    <p className="text-xs text-zinc-500">Import once, reuse for future Clip Generator jobs on this browser.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCookieSetup(false)}
                                className="p-2 rounded-lg hover:bg-white/10 text-zinc-400"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-5">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                    YouTube sometimes blocks server downloads. Add your own YouTube cookies once so Virlo can download videos like your browser.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-3">
                                <a
                                    href="https://www.youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
                                >
                                    Open YouTube <ExternalLink size={13} />
                                </a>
                                <a
                                    href="https://www.youtube.com/robots.txt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
                                >
                                    Open robots.txt <ExternalLink size={13} />
                                </a>
                                <a
                                    href="https://chromewebstore.google.com/search/cookies.txt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
                                >
                                    Find exporter <ExternalLink size={13} />
                                </a>
                            </div>

                            <ol className="space-y-2 text-sm text-zinc-300 list-decimal list-inside">
                                <li>Open a private/incognito browser window.</li>
                                <li>Log in to YouTube.</li>
                                <li>In the same private window, open https://www.youtube.com/robots.txt.</li>
                                <li>Export cookies using a cookies.txt browser extension.</li>
                                <li>Import the exported cookies.txt below.</li>
                                <li>Close the private/incognito window.</li>
                            </ol>

                            <div className="space-y-3">
                                <label className="block">
                                    <input
                                        type="file"
                                        accept=".txt,text/plain"
                                        onChange={(e) => handleCookieFile(e.target.files?.[0])}
                                        className="hidden"
                                    />
                                    <span className="block cursor-pointer text-center rounded-xl border border-dashed border-zinc-700 hover:border-primary/50 bg-white/5 px-4 py-4 text-sm text-zinc-300">
                                        Click to import cookies.txt
                                    </span>
                                </label>

                                <textarea
                                    value={cookieInput}
                                    onChange={(e) => {
                                        setCookieInput(e.target.value);
                                        setCookieError('');
                                        setCookieSaved(false);
                                    }}
                                    placeholder="Or paste Netscape cookies.txt content here..."
                                    className="w-full min-h-[140px] bg-black/30 border border-white/10 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:outline-none focus:border-primary/50 font-mono"
                                />

                                {cookieError && (
                                    <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                        {cookieError}
                                    </p>
                                )}

                                {cookieSaved && (
                                    <p className="text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                                        YouTube cookies saved in this browser.
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={handleSaveCookies}
                                    className="flex-1 btn-primary"
                                >
                                    Save YouTube Cookies
                                </button>
                                {youtubeCookiesConfigured && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onRemoveYouTubeCookies?.();
                                            setCookieInput('');
                                            setCookieSaved(false);
                                            setCookieError('');
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/15 transition-colors"
                                    >
                                        <Trash2 size={15} />
                                        Remove Saved Cookies
                                    </button>
                                )}
                            </div>

                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                                Your cookies are stored only in this browser and sent to the server only when you run a YouTube URL job. Virlo does not store them permanently on the server.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
