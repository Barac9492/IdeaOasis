// app/ideas/page.tsx
import { listIdeas } from '@/lib/db';
import { IdeaCard } from '@/features/ideas';

export default async function IdeasPage() {
  const ideas = await listIdeas();
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">모든 아이디어</h2>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map(i => <IdeaCard key={i.id} idea={i} />)}
      </div>
    </main>
  );
}
