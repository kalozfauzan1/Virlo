import { LayoutGrid, Play } from "lucide-react";

export default function UGCGalleryPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">UGC Gallery</h1>
        <p className="text-text-muted">Browse your generated AI shorts and clips.</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-20 text-center">
        <LayoutGrid size={40} className="text-text-muted mx-auto mb-4" />
        <h3 className="font-semibold mb-1">No videos yet</h3>
        <p className="text-sm text-text-muted max-w-sm mx-auto">
          Videos you generate will appear here.
        </p>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-40 pointer-events-none select-none">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-4 space-y-3">
            <div className="aspect-[9/16] rounded bg-bg-alt flex items-center justify-center"><Play size={24} className="text-text-subtle" /></div>
            <div className="h-3 w-2/3 rounded bg-bg-alt" />
            <div className="h-2 w-1/2 rounded bg-bg-alt" />
          </div>
        ))}
      </div>
    </div>
  );
}
