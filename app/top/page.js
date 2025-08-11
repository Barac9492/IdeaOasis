// app/top/page.tsx
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Adjust import if needed
import { collection, onSnapshot } from "firebase/firestore";
import type { Idea } from '@/lib/types';
import IdeaCard from '@/components/IdeaCard'; // Use cleaned-up card

export default function TopPicks() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [votes, setVotes] = useState<any[]>([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "ideas"), (snap) => {
      setIdeas(snap.docs.map(d => ({ id: d.id, ...d.data() } as Idea)));
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

  const businessIdeas = ideas.filter(i => 
    i.tags?.some(tag => ['business', 'startup', 'idea'].includes(tag.toLowerCase()))
  );

  const ranked = businessIdeas
    .map(i => ({ ...i, score: scoreByIdea[i.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="grid gap-4">
      {ranked.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
      {ranked.length === 0 && <p>사업 아이디어 없음</p>}
    </div>
  );
}
