// app/ideas/loading.tsx
import { IdeaCardSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">모든 아이디어</h2>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, idx) => (
          <IdeaCardSkeleton key={idx} />
        ))}
      </div>
    </main>
  );
}