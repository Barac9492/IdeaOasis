'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function IdeaDetail() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [bm, setBm] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "ideas", id)).then((d) => setIdea({ id: d.id, ...d.data() }));
    const q = query(collection(db, "comments"), where("ideaId", "==", id));
    return onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [id]);

  async function submit() {
    if (!user) { alert("로그인이 필요합니다."); return; }
    if (!text.trim()) return;
    await addDoc(collection(db, "comments"), {
      ideaId: id, text, authorEmail: user.email, type: "general", createdAt: serverTimestamp(),
    });
    setText("");
  }

  async function toggleBookmark(){
    if(!user){ alert("로그인이 필요합니다."); return; }
    const bid = `${id}_${user.uid}`;
    const ref = doc(db, "bookmarks", bid);
    const snap = await getDoc(ref);
    if (snap.exists()) { await deleteDoc(ref); setBm(false); }
    else { await setDoc(ref, { ideaId: id, userUid: user.uid, createdAt: new Date().toISOString() }); setBm(true); }
  }

  if (!idea) return <div>Loading…</div>;

  const delta = (idea?.signals?.last7dDelta ?? 0);

  return (
    <div className="grid gap-4">
      <section className="p-4 border rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{idea.title}</h1>
            <p className="text-sm text-zinc-600 mt-1">{idea.summary}</p>
            <div className="text-xs text-zinc-500 mt-2">
              <span className="mr-2">Source: {idea.sourcePlatform || "-"}</span>
              {idea.sourceURL && <a href={idea.sourceURL} target="_blank" className="underline mr-2">원문</a>}
              <span className="mr-2">Korea Fit: {idea.koreaFitScore ?? "-"}/5</span>
              <span>최근7일: {delta >= 0 ? "+" : ""}{delta}</span>
            </div>
            {Array.isArray(idea.koreanizationNotes) && idea.koreanizationNotes.filter(Boolean).length > 0 && (
              <ul className="list-disc ml-6 mt-2 text-xs">
                {idea.koreanizationNotes.filter(Boolean).map((n,ix)=><li key={ix}>{n}</li>)}
              </ul>
            )}
          </div>
          <button onClick={toggleBookmark} className="text-sm underline">{bm ? "★ 북마크됨" : "☆ 북마크"}</button>
        </div>
      </section>

      <section className="p-4 border rounded-lg">
        <h2 className="font-semibold mb-2">AI 요약 (댓글 기반)</h2>
        <div className="mt-2 text-sm">{idea.commentSummary ?? "아직 요약 없음"}</div>
      </section>

      <section className="p-4 border rounded-lg">
        <h2 className="font-semibold mb-2">댓글</h2>
        <div className="grid gap-2">
          {comments.map(c => (
            <div key={c.id} className="text-sm">
              <span className="text-zinc-400">{c.authorEmail}</span>: {c.text}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="의견을 남겨주세요" className="flex-1 px-3 py-2 rounded-lg border" />
          <button onClick={submit} className="px-3 py-2 rounded-lg border">등록</button>
        </div>
      </section>
    </div>
  );
}
