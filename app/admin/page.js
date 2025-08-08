'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app as firebaseApp } from '../../lib/firebase'; // 상대경로! (lib/firebase.js)

import BadgeInput from '../../components/BadgeInput';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const Section = ({ title, children }) => (
  <div className="bg-white border rounded-xl p-6 shadow space-y-4">
    <h3 className="font-semibold">{title}</h3>
    {children}
  </div>
);

const NumberInput = ({ label, value, onChange, min=0, max=10, step=1 }) => (
  <div className="flex items-center gap-3">
    <div className="w-40 text-sm">{label}</div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e)=>onChange(Number(e.target.value))}
      className="flex-1" />
    <span className="w-10 text-right text-sm font-medium">{value}</span>
  </div>
);

export default function AdminPage() {
  const [user, setUser] = useState(null);

  // 기본 필드
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [source, setSource] = useState('ideabrowser'); // origin/source
  const [originUrl, setOriginUrl] = useState('');

  // 새 확장 필드
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [badges, setBadges] = useState([]);                 // ["Perfect Timing", ...]
  const [offer, setOffer] = useState('');                   // 핵심 한 줄
  const [evidence, setEvidence] = useState({                // 검색 수요 등
    keyword: '',
    volume: '',
    growthPct: '',
    chartImg: ''
  });
  const [pricing, setPricing] = useState({                  // 과금 모델
    model: 'subscription',
    tiers: ''
  });

  // 스코어카드
  const [score, setScore] = useState({
    opportunity: 7,
    problem: 7,
    feasibility: 6,
    whyNow: 8,
  });

  // 한국화 노트(기존 필드 placeholder)
  const [note1, setNote1] = useState('');
  const [note2, setNote2] = useState('');
  const [note3, setNote3] = useState('');

  // 태그/사용사례/스택 (이전 단계에서 만들었던 메타)
  const [tags, setTags] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [techStack, setTechStack] = useState([]);

  const adminEmails = useMemo(()=>{
    const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
    return raw.split(',').map(s=>s.trim()).filter(Boolean);
  }, []);

  const isAdmin = user && adminEmails.includes(user.email);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=> setUser(u));
    return () => unsub();
  }, []);

  const handleGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return alert('Admin 권한 필요');

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      category: category.trim(),
      targetUser: targetUser.trim(),
      source,
      originUrl: originUrl.trim(),
      // 확장
      heroImageUrl: heroImageUrl.trim() || null,
      badges,
      offer: offer.trim() || null,
      evidence: {
        keyword: evidence.keyword.trim() || null,
        volume: evidence.volume ? Number(evidence.volume) : null,
        growthPct: evidence.growthPct ? Number(evidence.growthPct) : null,
        chartImg: evidence.chartImg?.trim() || null,
      },
      pricing: {
        model: pricing.model,
        tiers: pricing.tiers
          ? pricing.tiers.split(',').map(s=>s.trim()).filter(Boolean).slice(0,8)
          : [],
      },
      scorecards: score,               // {opportunity, problem, feasibility, whyNow}
      tags, useCases, techStack,       // 탐색/추천용 메타
      status: 'Pending',
      createdAt: serverTimestamp(),
      createdBy: user?.email || null,
      koreaNotes: [note1, note2, note3].filter(Boolean),
    };

    if (!payload.title) return alert('제목은 필수입니다.');
    await addDoc(collection(db, 'ideas'), payload);
    alert('등록 완료!');
    // 간단 리셋
    setTitle(''); setSummary(''); setCategory(''); setTargetUser('');
    setOriginUrl(''); setHeroImageUrl(''); setBadges([]); setOffer('');
    setEvidence({ keyword:'', volume:'', growthPct:'', chartImg:'' });
    setPricing({ model:'subscription', tiers:'' });
    setScore({ opportunity:7, problem:7, feasibility:6, whyNow:8 });
    setTags([]); setUseCases([]); setTechStack([]); setNote1(''); setNote2(''); setNote3('');
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <h2 className="text-center mb-6">Admin 로그인 필요</h2>
        <div className="flex justify-center">
          <button onClick={handleGoogle} className="px-4 py-2 bg-black text-white rounded-md">Sign in with Google</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 space-y-4">
        <p>권한이 없습니다. 요청 이메일: <b>{user.email}</b></p>
        <button onClick={handleSignOut} className="px-3 py-2 border rounded-md">Sign out</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex justify-end">
        <button onClick={handleSignOut} className="text-sm underline">Sign out</button>
      </div>

      {/* 기본 정보 */}
      <Section title="기본 정보">
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="rounded-md border px-3 py-2 sm:col-span-2" placeholder="제목"
            value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="rounded-md border px-3 py-2 sm:col-span-2" rows={3} placeholder="요약"
            value={summary} onChange={e=>setSummary(e.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="카테고리" value={category} onChange={e=>setCategory(e.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="Target User" value={targetUser} onChange={e=>setTargetUser(e.target.value)} />
          <select className="rounded-md border px-3 py-2" value={source} onChange={(e)=>setSource(e.target.value)}>
            <option value="ideabrowser">ideabrowser</option>
            <option value="manual">manual</option>
            <option value="crawler">crawler</option>
          </select>
          <input className="rounded-md border px-3 py-2" placeholder="원본 URL" value={originUrl} onChange={e=>setOriginUrl(e.target.value)} />
        </div>
      </Section>

      {/* Hero & Badges */}
      <Section title="Hero & Badges">
        <input className="w-full rounded-md border px-3 py-2" placeholder="Hero 이미지 URL"
          value={heroImageUrl} onChange={e=>setHeroImageUrl(e.target.value)} />
        <BadgeInput label="Badges" value={badges} onChange={setBadges} placeholder="예: Perfect Timing, Unfair Advantage, Massive Market" />
      </Section>

      {/* Scorecards */}
      <Section title="Scorecards (0–10)">
        <div className="space-y-3">
          <NumberInput label="Opportunity" value={score.opportunity} onChange={(v)=>setScore(s=>({...s, opportunity:v}))} />
          <NumberInput label="Problem" value={score.problem} onChange={(v)=>setScore(s=>({...s, problem:v}))} />
          <NumberInput label="Feasibility" value={score.feasibility} onChange={(v)=>setScore(s=>({...s, feasibility:v}))} />
          <NumberInput label="Why Now" value={score.whyNow} onChange={(v)=>setScore(s=>({...s, whyNow:v}))} />
        </div>
      </Section>

      {/* Offer / Evidence / Pricing */}
      <Section title="Offer / Evidence / Pricing">
        <input className="w-full rounded-md border px-3 py-2" placeholder="Offer (핵심 한 줄 제안)"
          value={offer} onChange={e=>setOffer(e.target.value)} />

        <div className="grid sm:grid-cols-2 gap-4">
          <input className="rounded-md border px-3 py-2" placeholder="Evidence: Keyword"
            value={evidence.keyword} onChange={e=>setEvidence(s=>({...s, keyword:e.target.value}))} />
          <input className="rounded-md border px-3 py-2" placeholder="Evidence: Volume (숫자)"
            value={evidence.volume} onChange={e=>setEvidence(s=>({...s, volume:e.target.value}))} />
          <input className="rounded-md border px-3 py-2" placeholder="Evidence: Growth % (숫자)"
            value={evidence.growthPct} onChange={e=>setEvidence(s=>({...s, growthPct:e.target.value}))} />
          <input className="rounded-md border px-3 py-2" placeholder="Evidence: Chart 이미지 URL(선택)"
            value={evidence.chartImg} onChange={e=>setEvidence(s=>({...s, chartImg:e.target.value}))} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <select className="rounded-md border px-3 py-2" value={pricing.model}
            onChange={(e)=>setPricing(s=>({...s, model:e.target.value}))}>
            <option value="subscription">subscription</option>
            <option value="marketplace">marketplace</option>
            <option value="one-time">one-time</option>
            <option value="hybrid">hybrid</option>
          </select>
          <input className="rounded-md border px-3 py-2" placeholder="티어 (쉼표구분, 예: Starter, Pro, Team)"
            value={pricing.tiers} onChange={(e)=>setPricing(s=>({...s, tiers:e.target.value}))} />
        </div>
      </Section>

      {/* 메타(추천 강화를 위해 유지) */}
      <Section title="탐색/추천 메타">
        <BadgeInput label="태그 (tags)" value={tags} onChange={setTags} placeholder="예: AI, Education, Marketplace" />
        <BadgeInput label="사용 사례 (useCases)" value={useCases} onChange={setUseCases} placeholder="예: Parents, Schools, Creators" />
        <BadgeInput label="기술 스택 (techStack)" value={techStack} onChange={setTechStack} placeholder="예: Next.js, Firebase, Stripe" />
      </Section>

      {/* 한국화 노트 */}
      <Section title="한국화 노트 (3줄)">
        <div className="grid gap-3">
          <input className="rounded-md border px-3 py-2" placeholder="노트 1" value={note1} onChange={e=>setNote1(e.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="노트 2" value={note2} onChange={e=>setNote2(e.target.value)} />
          <input className="rounded-md border px-3 py-2" placeholder="노트 3" value={note3} onChange={e=>setNote3(e.target.value)} />
        </div>
      </Section>

      <div className="py-2" />
      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white rounded-md py-3 font-medium">
        등록
      </button>
    </div>
  );
}
