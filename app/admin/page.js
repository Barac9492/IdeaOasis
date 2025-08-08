'use client';
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({
    title: "", summary: "", category: "", koreaFitScore: 3, sourcePlatform: "X", status: "Pending"
  });

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    return onSnapshot(collection(db, "ideas"), (snap) => {
      setIdeas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  if (!user) return <div>Admin 로그인 필요</div>;
  if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAILS) return <div>권한 없음</div>;

  async function createIdea() {
    await addDoc(collection(db, "ideas"), {
      ...form,
      uploadedAt: serverTimestamp(),
    });
    setForm({ title: "", summary: "", category: "", koreaFitScore: 3, sourcePlatform: "X", status: "Pending" });
  }

  async function patchIdea(id, changes) {
    await updateDoc(doc(db, "ideas", id), changes);
  }

  return (
    <div className="grid gap-6">
      <section className="p-4 border rounded-lg">
        <h2 className="font-semibold mb-3">새 아이디어 등록</h2>
        <div className="grid gap-3">
          <input 
            placeholder="제목" 
            value={form.title} 
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          />
          <textarea 
            placeholder="요약" 
            value={form.summary} 
            onChange={e => setForm({ ...form, summary: e.target.value })}
            className="px-3 py-2 border rounded-lg h-24"
          />
          <div className="flex gap-2">
            <select 
              value={form.category} 
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">카테고리 선택</option>
              <option value="tech">기술</option>
              <option value="health">헬스</option>
              <option value="finance">금융</option>
              <option value="education">교육</option>
              <option value="lifestyle">라이프스타일</option>
            </select>
            <select 
              value={form.koreaFitScore} 
              onChange={e => setForm({ ...form, koreaFitScore: parseInt(e.target.value) })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value={1}>Korea Fit: 1</option>
              <option value={2}>Korea Fit: 2</option>
              <option value={3}>Korea Fit: 3</option>
              <option value={4}>Korea Fit: 4</option>
              <option value={5}>Korea Fit: 5</option>
            </select>
          </div>
          <button 
            onClick={createIdea}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            등록
          </button>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="font-semibold">아이디어 관리</h2>
        {ideas.map(i => (
          <div key={i.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="font-semibold">{i.title}</div>
                <div className="text-sm text-zinc-600 mt-1">{i.summary}</div>
                <div className="text-xs text-zinc-500 mt-2">
                  Korea Fit: {i.koreaFitScore}/5 • {i.sourcePlatform} • {i.category}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => patchIdea(i.id, { status: "Approved" })}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  승인
                </button>
                <button 
                  onClick={() => patchIdea(i.id, { status: "Rejected" })}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  거절
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
