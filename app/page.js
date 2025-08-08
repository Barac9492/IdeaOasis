'use client';
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);
  const [bookmarked, setBookmarked] = useState({}); // ideaId -> true

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

  async function vote(ideaId, up) {
    if (!uid || !email) { alert("로그인이 필요합니다."); return; }
    const id = `${ideaId}_${uid}`;
    const ref = doc(db, "votes", id);
    const exists = await getDoc(ref);
    if (exists.exists()) { alert("이미 투표했습니다."); return; }
    await setDoc(ref, { ideaId, voterUid: uid, voterEmail: email, vote: up ? "up" : "down", votedAt: new Date().toISOString() });
  }

  async function toggleBookmark(ideaId){
    if(!uid){ alert("로그인이 필요합니다."); return; }
    const id = `${ideaId}_${uid}`;
    const ref = doc(db, "bookmarks", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
      setBookmarked(prev => ({...prev, [ideaId]: false}));
    } else {
      await setDoc(ref, { ideaId, userUid: uid, createdAt: new Date().toISOString() });
      setBookmarked(prev => ({...prev, [ideaId]: true}));
    }
  }

  return (
    <div className="grid gap-4">
      {ideas.map((i) => {
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
                {i.tags && i.tags.length > 0 && (
                  <div className="mt-2">
                    {i.tags.slice(0, 5).map((tag, idx) => (
                      <span key={idx} className="inline-block px-2 py-0.5 text-xs rounded-full border mr-1 mt-1">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  <button onClick={() => vote(i.id, true)} className="px-3 py-1 rounded-lg border">▲</button>
                  <button onClick={() => vote(i.id, false)} className="px-3 py-1 rounded-lg border">▼</button>
                </div>
                <button onClick={()=>toggleBookmark(i.id)} className="text-xs underline">
                  {bookmarked[i.id] ? "★ 북마크됨" : "☆ 북마크"}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
