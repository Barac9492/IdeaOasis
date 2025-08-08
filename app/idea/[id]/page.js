'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function IdeaDetail() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

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
      ideaId: id,
      text,
      authorEmail: user.email,
      createdAt: serverTimestamp(),
    });
    setText("");
  }

  if (!idea) return <div>Loading…</div>;

  return (
    <div className="grid gap-4">
      <section className="p-4 border rounded-lg">
        <h1 className="text-xl font-semibold">{idea.title}</h1>
        <p className="text-sm text-zinc-400 mt-1">{idea.summary}</p>
        {idea.sourceURL && (
          <a href={idea.sourceURL} target="_blank" className="text-sm underline mt-2 inline-block">원문 보기 →</a>
        )}
        <div className="text-xs text-zinc-500 mt-2">Korea Fit: {idea.koreaFitScore ?? "-"}/5</div>
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
