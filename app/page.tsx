// app/page.tsx
import { listIdeas } from '@/lib/db';
import IdeaCard from '@/components/IdeaCard';

export default async function HomePage() {
  const ideas = await listIdeas();
  return (
    <main className="mx-auto max-w-5xl p-6">
      <section className="mb-6">
        <h1 className="text-2xl font-bold">IdeaOasis</h1>
        <p className="text-zinc-600 mt-1">글로벌 아이디어를 한국 맥락으로 빠르게.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.slice(0, 8).map(i => <IdeaCard key={i.id} idea={i} />)}
      </section>
    </main>
  );
}
