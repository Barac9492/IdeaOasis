// app/page.tsx
import { listIdeas } from '@/lib/db';
import { IdeaCard } from '@/features/ideas';
import Link from 'next/link';

export default async function HomePage() {
  const ideas = await listIdeas();
  const showcase = ideas.slice(0, 6);
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Global startup ideas, Korea-fit and curated daily</h1>
        <p className="text-zinc-600 mt-3">Discover high-signal ideas tailored for the Korean market. Skim value props, Korea Fit, effort, risks, and jump in.</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link href="/top" className="rounded-xl bg-black text-white px-4 py-2">View Today’s Pick</Link>
          <Link href="/ideas" className="rounded-xl border px-4 py-2">Browse All</Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Trending Today</h2>
          <Link href="/top" className="text-sm underline">See more</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showcase.map((i) => (
            <IdeaCard key={i.id} idea={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
