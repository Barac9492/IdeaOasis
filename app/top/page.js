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
      {ranked.map((i) => (
        <article key={i.id} className="p-4 border rounded-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link href={`/idea/${i.id}`} className="font-semibold text-lg hover:underline">{i.title}</Link>
              <p className="text-sm text-zinc-400 mt-1">{i.summary}</p>
            </div>
            <div className="text-sm">Score: {i.score}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
