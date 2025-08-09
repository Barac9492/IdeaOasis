'use client';
import { useEffect, useState } from "react";
import { db, auth } from "@/shared/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { IdeaCard } from "@/features/ideas";
import type { Idea } from "@/shared/lib/types";

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const q = query(collection(db, "ideas"), orderBy("uploadedAt", "desc"), limit(50));
    return onSnapshot(q, (snap) => {
      setIdeas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null);
      setEmail(u?.email ?? null);
    });
  }, []);

  async function vote(ideaId: string, up: boolean) {
    if (!uid || !email) { 
      alert("로그인이 필요합니다."); 
      return; 
    }
    const id = `${ideaId}_${uid}`;
    const ref = doc(db, "votes", id);
    const exists = await getDoc(ref);
    if (exists.exists()) { 
      alert("이미 투표했습니다."); 
      return; 
    }
    await setDoc(ref, { 
      ideaId, 
      voterUid: uid, 
      voterEmail: email, 
      vote: up ? "up" : "down", 
      votedAt: new Date().toISOString() 
    });
  }

  async function toggleBookmark(ideaId: string) {
    if (!uid) { 
      alert("로그인이 필요합니다."); 
      return; 
    }
    const id = `${ideaId}_${uid}`;
    const ref = doc(db, "bookmarks", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
      setBookmarked(prev => ({ ...prev, [ideaId]: false }));
    } else {
      await setDoc(ref, { 
        ideaId, 
        userUid: uid, 
        createdAt: new Date().toISOString() 
      });
      setBookmarked(prev => ({ ...prev, [ideaId]: true }));
    }
  }

  return (
    <div className="grid gap-4">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onVote={vote}
          onBookmark={toggleBookmark}
          isBookmarked={bookmarked[idea.id]}
        />
      ))}
    </div>
  );
}
