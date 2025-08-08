'use client';
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function Top() {
  const [ideas, setIdeas] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "ideas"), (snap) => {
      setIdeas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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

  return (
    <div className="grid gap-4">
      {ranked.map((i) => {
        const delta = (i?.signals?.last7dDelta ?? 0);
        return (
          <article key={i.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href={`/idea/${i.id}`} className="font-semibold text-lg hover:underline">{i.title}</Link>
                <p className="text-sm text-zinc-600 mt-1">{i.summary}</p>
                <div className="text-xs text-zinc-500 mt-2">
                  <span className="mr-2">Source: {i.sourcePlatform || "-"}</span>
                  {i.sourceURL && <a className="underline mr-2" href={i.sourceURL} target="_blank">원문</a>}
                  <span className="mr-2">Korea Fit: {i.koreaFitScore ?? "-"}/5</span>
                  <span>최근7일: {delta >= 0 ? "+" : ""}{delta}</span>
                </div>
              </div>
              <div className="text-sm">Score: {i.score}</div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
