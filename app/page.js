'use client';
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);

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
      votedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="grid gap-4">
      {ideas.map((i) => (
        <article key={i.id} className="p-4 border rounded-lg">
          <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/idea/${i.id}`} className="font-semibold text-lg hover:underline">{i.title}</Link>
            <p className="text-sm text-zinc-400 mt-1">{i.summary}</p>
          </div>
                      <div className="flex gap-2">
              <button 
                onClick={() => vote(i.id, true)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ▲
              </button>
              <button 
                onClick={() => vote(i.id, false)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ▼
              </button>
            </div>
        </div>
      </article>
    ))}
  </div>
  );
}
