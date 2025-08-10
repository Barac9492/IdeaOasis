// components/Skeletons.tsx
'use client';

export function IdeaCardSkeleton() {
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="flex items-start gap-3 animate-pulse">
        <div className="w-16 h-16 rounded-xl bg-zinc-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-200 rounded w-3/4" />
          <div className="h-3 bg-zinc-200 rounded w-full" />
          <div className="h-3 bg-zinc-200 rounded w-5/6" />
          <div className="h-2 bg-zinc-200 rounded w-1/2 mt-2" />
        </div>
      </div>
    </div>
  );
}

export function IdeaDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-6 bg-zinc-200 rounded w-2/3 mb-4" />
      <div className="h-4 bg-zinc-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-zinc-200 rounded w-5/6 mb-2" />
      <div className="h-4 bg-zinc-200 rounded w-4/6 mb-6" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-3">
          <div className="h-40 bg-zinc-200 rounded" />
          <div className="h-40 bg-zinc-200 rounded" />
          <div className="h-40 bg-zinc-200 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-24 bg-zinc-200 rounded" />
          <div className="h-24 bg-zinc-200 rounded" />
        </div>
      </div>
    </div>
  );
}