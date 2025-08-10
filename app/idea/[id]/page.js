'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "../../../lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, setDoc, deleteDoc, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import SectionCard from "../../../components/SectionCard";
import ScoreCard from "../../../components/ScoreCard";
import BadgeRow from "../../../components/BadgeRow";

export default function IdeaDetail() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [bm, setBm] = useState(false);
  const [relatedIdeas, setRelatedIdeas] = useState([]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "ideas", id)).then((d) => {
      const ideaData = { id: d.id, ...d.data() };
      setIdea(ideaData);
      
      // Load related ideas
      if (ideaData.tags && ideaData.tags.length > 0) {
        const relatedQuery = query(
          collection(db, "ideas"),
          where("tags", "array-contains-any", ideaData.tags.slice(0, 10)),
          limit(6)
        );
        onSnapshot(relatedQuery, (snap) => {
          const related = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(item => item.id !== id) // exclude current idea
            .slice(0, 3); // top 3
          setRelatedIdeas(related);
        });
      } else if (ideaData.category) {
        // fallback to category
        const relatedQuery = query(
          collection(db, "ideas"),
          where("category", "==", ideaData.category),
          limit(3)
        );
        onSnapshot(relatedQuery, (snap) => {
          const related = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(item => item.id !== id)
            .slice(0, 3);
          setRelatedIdeas(related);
        });
      }
    });
    
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

  if (!idea) return <div><div className="max-w-6xl mx-auto px-4 py-8"><div className="animate-pulse h-6 bg-zinc-200 rounded w-2/3 mb-4" /><div className="animate-pulse h-4 bg-zinc-200 rounded w-1/2 mb-2" /><div className="animate-pulse h-4 bg-zinc-200 rounded w-5/6 mb-2" /><div className="animate-pulse h-4 bg-zinc-200 rounded w-4/6 mb-6" /></div></div>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{idea.title}</h1>
        {idea.offer && <p className="text-gray-800 mt-1">{idea.offer}</p>}
        <div className="mt-2">
          <BadgeRow
            badges={idea.badges || []}
            tags={idea.tags || []}
            useCases={idea.useCases || []}
            techStack={idea.techStack || []}
          />
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* 본문 */}
        <article className="space-y-4">
          {idea.summary && (
            <SectionCard title="Summary">
              <p className="text-gray-700">{idea.summary}</p>
            </SectionCard>
          )}

          {idea.adminReview && (
            <SectionCard title="Admin Review">
              <p className="text-gray-800 whitespace-pre-wrap">{idea.adminReview}</p>
            </SectionCard>
          )}

          {idea.evidence && (
            <SectionCard title="Evidence">
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  {idea.evidence.keyword && <>Keyword: <b>{idea.evidence.keyword}</b></>}
                  {idea.evidence.volume && <> · Volume: <b>{idea.evidence.volume}</b></>}
                  {idea.evidence.growthPct && <> · Growth: <b>{idea.evidence.growthPct}</b></>}
                </div>
                {idea.evidence.chartImg && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={idea.evidence.chartImg} alt="trend" className="rounded-md border" />
                )}
              </div>
            </SectionCard>
          )}

          {idea.pricing && (
            <SectionCard title="Pricing">
              <div className="text-sm text-gray-700 space-y-2">
                {idea.pricing.model && <div>Model: <b>{idea.pricing.model}</b></div>}
                {Array.isArray(idea.pricing.tiers) && idea.pricing.tiers.length > 0 && (
                  <ul className="list-disc pl-5">
                    {idea.pricing.tiers.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                )}
              </div>
            </SectionCard>
          )}

          {/* 댓글 섹션 */}
          <SectionCard title="댓글">
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
          </SectionCard>

          {/* AI 요약 */}
          <SectionCard title="AI 요약 (댓글 기반)">
            <div className="text-sm">{idea.commentSummary ?? "아직 요약 없음"}</div>
          </SectionCard>

          {/* Related Ideas Section */}
          {relatedIdeas.length > 0 && (
            <SectionCard title="관련 아이디어">
              <div className="grid gap-3">
                {relatedIdeas.map((related) => (
                  <Link key={related.id} href={`/idea/${related.id}`} className="block p-3 border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-sm">{related.title}</div>
                    <div className="text-xs text-zinc-600 mt-1">{related.summary}</div>
                    {related.tags && related.tags.length > 0 && (
                      <div className="mt-2">
                        {related.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="inline-block px-1.5 py-0.5 text-xs rounded-full border mr-1">{tag}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </SectionCard>
          )}
        </article>

        {/* 사이드바 */}
        <aside className="space-y-4">
          <SectionCard title="Scorecards">
            <ScoreCard scores={idea.scorecards || {}} />
          </SectionCard>

          <SectionCard title="Meta">
            <div className="text-sm text-gray-700 space-y-1">
              <div>Category: <b>{idea.category || "-"}</b></div>
              <div>Target User: <b>{idea.targetUser || "-"}</b></div>
              <div>Status: <b>{idea.status || "Pending"}</b></div>
              <div className="truncate">
                Source: {idea.sourcePlatform ? <b>{idea.sourcePlatform}</b> : "-"}
              </div>
              {idea.sourceURL && (
                <a
                  href={idea.sourceURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {idea.sourceURL}
                </a>
              )}
            </div>
          </SectionCard>

          {/* 북마크 버튼 */}
          <SectionCard title="Actions">
            <button onClick={toggleBookmark} className="w-full px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
              {bm ? "★ 북마크됨" : "☆ 북마크"}
            </button>
          </SectionCard>
        </aside>
      </div>
    </main>
  );
}
