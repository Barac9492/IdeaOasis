// app/tags/[tag]/page.tsx
import { listIdeas } from '@/lib/db';
import { IdeaCard } from '@/features/ideas';
import Link from 'next/link';

export default async function TagPage({ params }: { params: { tag: string } }) {
  const ideas = await listIdeas();
  const tag = decodeURIComponent(params.tag);
  const filtered = ideas.filter((i) => (i.tags || []).includes(tag));
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tag · {tag}</h2>
        <Link href="/top" className="text-sm underline">Trending</Link>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((i) => (
          <IdeaCard key={i.id} idea={i} />
        ))}
      </div>
    </main>
  );
}