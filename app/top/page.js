'use client';
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import Empty from "../../components/Empty";
import SkeletonCard from "../../components/SkeletonCard";

export default function Top() {
  const [ideas, setIdeas] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "ideas"), (snap) => {
      setIdeas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    const unsub2 = onSnapshot(collection(db, "votes"), (snap) => {
      setVotes(snap.docs.map(d => d.data()));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const scoreByIdea = votes.reduce((acc, v) => {
    acc[v.ideaId] = (acc[v.ideaId] || 0) + (v.vote === "up" ? 1 : -1);
    return acc;
  }, {});

  const ranked = ideas
    .map(i => ({ ...i, score: scoreByIdea[i.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (!ranked.length) {
    return <Empty title="랭크된 아이디어가 없어요" description="첫 투표를 기다리고 있어요" />;
  }

  return (
    <ul className="grid gap-4">
      {ranked.map((i) => {
        const delta = (i?.signals?.last7dDelta ?? 0);
        return (
          <motion.li key={i.id} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
            <Card className="rounded-2xl shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-base">
                    <Link href={`/idea/${i.id}`} className="hover:underline">{i.title}</Link>
                  </CardTitle>
                  <div className="text-sm">Score: {i.score}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-zinc-600">{i.summary}</p>
                {i.offer && <p className="text-sm text-gray-800 dark:text-gray-200">{i.offer}</p>}
                <div className="flex flex-wrap gap-1">
                  {(i.badges ?? []).slice(0, 3).map((b, idx) => (
                    <span key={`badge-${idx}`} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">
                      {b}
                    </span>
                  ))}
                  {(i.tags ?? []).slice(0, 3).map((t, idx) => (
                    <span key={`tag-${idx}`} className="px-2 py-0.5 text-xs rounded-full bg-blue-50 border border-blue-200">
                      #{t}
                    </span>
                  ))}
                </div>
                {i.scorecards?.opportunity != null && (
                  <div className="text-xs text-gray-500">
                    Opportunity: <span className="font-semibold">{i.scorecards.opportunity}/10</span>
                  </div>
                )}
                <div className="text-xs text-zinc-500">
                  <span className="mr-2">Source: {i.sourcePlatform || "-"}</span>
                  {i.sourceURL && <a className="underline mr-2" href={i.sourceURL} target="_blank">원문</a>}
                  <span className="mr-2">Korea Fit: {i.koreaFitScore ?? "-"}/5</span>
                  <span>최근7일: {delta >= 0 ? "+" : ""}{delta}</span>
                </div>
              </CardContent>
            </Card>
          </motion.li>
        );
      })}
    </ul>
  );
}
