'use client';
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    category: "",
    targetUser: "",
    businessModel: "",
    sourceURL: "",
    sourcePlatform: "ideabrowser",
    status: "Pending",
    // KoreaFit detail parts
    kfit: { regulatory: 1, infra: 1, behavior: 1, competition: 0 },
    // Koreanization notes (3 bullets)
    notes: ["", "", ""],
    // Connection metadata
    tags: "",
    useCases: "",
    techStack: "",
  });

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    return onSnapshot(collection(db, "ideas"), (snap) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // newest first
      setIdeas(arr.sort((a,b) => (b?.uploadedAt?.seconds ?? 0) - (a?.uploadedAt?.seconds ?? 0)));
    });
  }, []);

  if (!user) return <div className="text-center mt-8 font-semibold">Admin 로그인 필요</div>;
  if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAILS) return <div className="text-center mt-8">권한 없음</div>;

  function kfitTotal(k) {
    // 0–2 (regulatory), 0–1 (infra), 0–1 (behavior), 0–1 (competition) => max 5
    return Number(k.regulatory) + Number(k.infra) + Number(k.behavior) + Number(k.competition);
  }

  async function createIdea() {
    const koreaFitScore = kfitTotal(form.kfit);
    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      category: form.category || "",
      targetUser: form.targetUser || "",
      businessModel: form.businessModel || "",
      sourceURL: form.sourceURL || "",
      sourcePlatform: form.sourcePlatform,
      uploadedAt: serverTimestamp(),
      adminReview: "", // optional legacy
      status: form.status,
      // new fields
      koreaFitDetail: {
        regulatory: Number(form.kfit.regulatory),
        infra: Number(form.kfit.infra),
        behavior: Number(form.kfit.behavior),
        competition: Number(form.kfit.competition),
      },
      koreaFitScore,
      koreanizationNotes: form.notes.map(s => (s || "").trim()).slice(0,3),
      // Connection metadata
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean).slice(0,10),
      useCases: form.useCases.split(',').map(s => s.trim()).filter(Boolean).slice(0,10),
      techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean).slice(0,10),
      signals: { bookmarks: 0, last7dDelta: 0 }, // updated later by automation
    };
    await addDoc(collection(db, "ideas"), payload);
    setForm({
      ...form,
      title: "", summary: "", sourceURL: "",
      notes: ["", "", ""],
      tags: "", useCases: "", techStack: "",
    });
  }

  async function patchIdea(id, changes) {
    await updateDoc(doc(db, "ideas", id), changes);
  }

  return (
    <div className="grid gap-6">
      <section className="p-4 border rounded-lg max-w-2xl mx-auto">
        <h2 className="font-semibold mb-3">새 아이디어 등록</h2>
        <div className="grid gap-2">
          <input className="px-3 py-2 rounded-lg border" placeholder="제목" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          <textarea className="px-3 py-2 rounded-lg border" placeholder="요약" value={form.summary} onChange={e=>setForm({...form, summary:e.target.value})}/>
          <div className="grid grid-cols-2 gap-2">
            <input className="px-3 py-2 rounded-lg border" placeholder="카테고리" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}/>
            <input className="px-3 py-2 rounded-lg border" placeholder="Target User" value={form.targetUser} onChange={e=>setForm({...form, targetUser:e.target.value})}/>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select className="px-3 py-2 rounded-lg border" value={form.businessModel} onChange={e=>setForm({...form, businessModel:e.target.value})}>
              <option value="">Business Model</option>
              <option value="B2B SaaS">B2B SaaS</option>
              <option value="B2C">B2C</option>
              <option value="Marketplace">Marketplace</option>
              <option value="Platform">Platform</option>
              <option value="Fintech">Fintech</option>
            </select>
            <select className="px-3 py-2 rounded-lg border" value={form.sourcePlatform} onChange={e=>setForm({...form, sourcePlatform:e.target.value})}>
              <option>ideabrowser</option>
              <option>X</option>
              <option>Hacker News</option>
              <option>Reddit</option>
              <option>YC</option>
            </select>
          </div>
          <input className="px-3 py-2 rounded-lg border" placeholder="원본 URL" value={form.sourceURL} onChange={e=>setForm({...form, sourceURL:e.target.value})}/>

          <div className="grid gap-2 mt-2">
            <input className="px-3 py-2 rounded-lg border" placeholder="태그 (쉼표로 구분)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})}/>
            <input className="px-3 py-2 rounded-lg border" placeholder="사용 사례 (쉼표로 구분)" value={form.useCases} onChange={e=>setForm({...form, useCases:e.target.value})}/>
            <input className="px-3 py-2 rounded-lg border" placeholder="기술 스택 (쉼표로 구분)" value={form.techStack} onChange={e=>setForm({...form, techStack:e.target.value})}/>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2">
            <div>
              <div className="text-xs mb-1">Regulatory (0-2)</div>
              <select className="px-2 py-2 rounded-lg border" value={form.kfit.regulatory} onChange={e=>setForm({...form, kfit:{...form.kfit, regulatory:e.target.value}})}>
                {[0,1,2].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs mb-1">Infra (0-1)</div>
              <select className="px-2 py-2 rounded-lg border" value={form.kfit.infra} onChange={e=>setForm({...form, kfit:{...form.kfit, infra:e.target.value}})}>
                {[0,1].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs mb-1">Behavior (0-1)</div>
              <select className="px-2 py-2 rounded-lg border" value={form.kfit.behavior} onChange={e=>setForm({...form, kfit:{...form.kfit, behavior:e.target.value}})}>
                {[0,1].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs mb-1">Competition (0-1)</div>
              <select className="px-2 py-2 rounded-lg border" value={form.kfit.competition} onChange={e=>setForm({...form, kfit:{...form.kfit, competition:e.target.value}})}>
                {[0,1].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-2 mt-2">
            <div className="text-sm font-medium">한국화 노트 (3줄)</div>
            {form.notes.map((v,idx)=>(
              <input key={idx} className="px-3 py-2 rounded-lg border" placeholder={`노트 ${idx+1}`} value={v}
                     onChange={e=>{
                       const arr=[...form.notes]; arr[idx]=e.target.value; setForm({...form, notes:arr});
                     }}/>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <select className="px-3 py-2 rounded-lg border" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
              {["Pending","Approved","Rejected"].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <div className="px-3 py-2 rounded-lg border bg-gray-50">
              Korea Fit: <b>{kfitTotal(form.kfit)}</b> / 5
            </div>
          </div>

          <button onClick={createIdea} className="px-3 py-2 rounded-lg border bg-blue-600 text-white mt-2">등록</button>
        </div>
      </section>

      <section className="grid gap-3 max-w-3xl mx-auto">
        {ideas.map(i => (
          <div key={i.id} className="p-4 border rounded-lg flex justify-between items-start">
            <div>
              <div className="font-semibold">{i.title}</div>
              <div className="text-xs text-zinc-500 mt-1">
                Source: {i.sourcePlatform || "-"} {i.sourceURL ? "• " : ""}{i.sourceURL && <a className="underline" href={i.sourceURL} target="_blank">원문</a>}
                {" • "}Korea Fit {i.koreaFitScore ?? "-"} / 5
                {" • "}최근7일: {i?.signals?.last7dDelta ?? 0 >= 0 ? "+" : ""}{i?.signals?.last7dDelta ?? 0}
              </div>
              {i.koreanizationNotes?.length ? (
                <ul className="list-disc ml-5 mt-1 text-xs">
                  {i.koreanizationNotes.filter(Boolean).map((n,ix)=><li key={ix}>{n}</li>)}
                </ul>
              ) : null}
            </div>
            <div className="flex gap-2">
              <button onClick={()=>patchIdea(i.id, { status: "Approved" })} className="px-3 py-1 rounded-lg border">승인</button>
              <button onClick={()=>patchIdea(i.id, { status: "Rejected" })} className="px-3 py-1 rounded-lg border">거절</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
