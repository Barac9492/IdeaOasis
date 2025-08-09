// app/ideas/[id]/page.tsx
import { getIdea } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function IdeaDetail({ params }: { params: { id: string } }) {
  const idea = await getIdea(params.id);
  if (!idea) return notFound();

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{idea.title}</h1>
        <div className="mt-2 text-sm text-zinc-600">{idea.sourceName} · <a className="underline" href={idea.sourceUrl} target="_blank">원문</a></div>
      </header>

      {idea.summary3 && <p className="text-zinc-800">{idea.summary3}</p>}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4 space-y-2">
          <h3 className="font-semibold">Korea Fit</h3>
          <div className="text-2xl">{idea.koreaFit ?? '-'} /10</div>
        </div>
        <div className="rounded-2xl border p-4 space-y-2 md:col-span-2">
          <h3 className="font-semibold">Why Now</h3>
          <p className="text-sm text-zinc-700">{idea.whyNow ?? '-'}</p>
        </div>
      </section>

      <section className="rounded-2xl border p-4">
        <h3 className="font-semibold">리스크</h3>
        <ul className="list-disc pl-5 text-sm mt-2">
          {idea.risks?.length ? idea.risks.map(r => <li key={r}>{r}</li>) : <li>-</li>}
        </ul>
      </section>
    </main>
  );
}
