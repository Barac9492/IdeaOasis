"use client";
import { useEffect, useMemo, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import IdeaCard from "@/components/IdeaCard";

export default function Top() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [filter, setFilter] = useState<{ tag: string; platform: string }>({ tag: "", platform: "" });
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "ideas"), (snap) => {
      setIdeas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsub2 = onSnapshot(collection(db, "votes"), (snap) => {
      setVotes(snap.docs.map((d) => d.data()));
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const scoreByIdea = useMemo(() => {
    return votes.reduce((acc: Record<string, number>, v: any) => {
      acc[v.ideaId] = (acc[v.ideaId] || 0) + (v.vote === "up" ? 1 : -1);
      return acc;
    }, {} as Record<string, number>);
  }, [votes]);

  const enriched = useMemo(() => {
    return ideas
      .map((i) => ({ ...i, score: scoreByIdea[i.id] ?? 0 }))
      .filter((i) => {
        const tagOk = !filter.tag || (i.tags || []).includes(filter.tag);
        const platformOk = !filter.platform || (i.sourcePlatform || i.sourceName || "").toLowerCase().includes(filter.platform.toLowerCase());
        return tagOk && platformOk;
      });
  }, [ideas, scoreByIdea, filter]);

  const ranked = useMemo(() => [...enriched].sort((a, b) => b.score - a.score), [enriched]);
  const latest = useMemo(() => [...enriched].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.publishedAt || 0).getTime();
    const bTime = new Date(b.createdAt || b.publishedAt || 0).getTime();
    return bTime - aTime;
  }), [enriched]);

  const hero = ranked[0];
  const trending = ranked.slice(1, 6);
  const latestVisible = latest.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-3 items-center">
          <input
            value={filter.tag}
            onChange={(e) => setFilter((f) => ({ ...f, tag: e.target.value }))}
            className="w-40 border rounded-lg px-3 py-1.5 text-sm"
            placeholder="태그 필터"
          />
          <input
            value={filter.platform}
            onChange={(e) => setFilter((f) => ({ ...f, platform: e.target.value }))}
            className="w-56 border rounded-lg px-3 py-1.5 text-sm"
            placeholder="플랫폼/출처 필터"
          />
          <button onClick={() => setFilter({ tag: "", platform: "" })} className="ml-auto text-sm underline">
            초기화
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4">
        {/* Today’s Pick */}
        {hero && (
          <section>
            <h2 className="text-lg font-semibold mb-3">오늘의 픽</h2>
            <article className="p-4 md:p-6 border rounded-2xl bg-white">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-64 md:h-40 w-full h-40 rounded-xl overflow-hidden border bg-zinc-50">
                  {hero.sourceURL || hero.sourceUrl ? (
                    <img
                      src={`/api/og?url=${encodeURIComponent(hero.sourceURL || hero.sourceUrl)}`}
                      alt="hero"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/idea/${hero.id}`} className="font-semibold text-xl hover:underline">
                    {hero.title}
                  </Link>
                  {hero.summary && <p className="text-sm text-zinc-700 mt-2 whitespace-pre-wrap">{hero.summary}</p>}
                  {(hero.tags || []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {(hero.tags || []).slice(0, 6).map((t: string) => (
                        <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 border border-zinc-200">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Trending Ideas */}
        {trending.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-3">트렌딩 아이디어</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.map((i) => (
                <IdeaCard key={i.id} idea={{
                  id: i.id,
                  title: i.title,
                  sourceUrl: i.sourceURL || i.sourceUrl,
                  sourceName: i.sourcePlatform || i.sourceName,
                  publishedAt: i.publishedAt,
                  summary3: i.summary,
                  tags: i.tags,
                  koreaFit: i.koreaFitScore ?? i.koreaFit,
                  votesUp: i.votesUp,
                  votesDown: i.votesDown,
                }} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Ideas */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-3">최신 아이디어</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestVisible.map((i) => (
              <IdeaCard key={`latest-${i.id}`} idea={{
                id: i.id,
                title: i.title,
                sourceUrl: i.sourceURL || i.sourceUrl,
                sourceName: i.sourcePlatform || i.sourceName,
                publishedAt: i.publishedAt,
                summary3: i.summary,
                tags: i.tags,
                koreaFit: i.koreaFitScore ?? i.koreaFit,
                votesUp: i.votesUp,
                votesDown: i.votesDown,
              }} />
            ))}
          </div>
          {latest.length > visibleCount && (
            <div className="flex justify-center mt-4">
              <button onClick={() => setVisibleCount((c) => c + 12)} className="px-4 py-2 border rounded-lg">
                더 보기
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
