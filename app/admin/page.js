'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app as firebaseApp } from '@/shared/lib/firebase';
import BadgeInput from '@/shared/ui/components/BadgeInput';
import type { Idea } from '@/shared/lib/types';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border rounded-xl p-6 shadow space-y-4">
    <h3 className="font-semibold">{title}</h3>
    {children}
  </div>
);

const NumberInput = ({ label, value, onChange, min = 0, max = 10, step = 1 }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-40 text-sm">{label}</div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="flex-1" 
    />
    <span className="w-10 text-right text-sm font-medium">{value}</span>
  </div>
);

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);

  // 기본 필드
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [source, setSource] = useState('ideabrowser');
  const [originUrl, setOriginUrl] = useState('');

  // 새 확장 필드
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [badges, setBadges] = useState<string[]>([]);
  const [offer, setOffer] = useState('');
  const [evidence, setEvidence] = useState({
    keyword: '',
    volume: '',
    growthPct: '',
    chartImg: ''
  });
  const [pricing, setPricing] = useState({
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

  // 한국화 노트
  const [note1, setNote1] = useState('');
  const [note2, setNote2] = useState('');
  const [note3, setNote3] = useState('');

  // 태그/사용사례/스택
  const [tags, setTags] = useState<string[]>([]);
  const [useCases, setUseCases] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);

  const adminEmails = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }, []);

  const isAdmin = user && adminEmails.includes(user.email);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return alert('Admin 권한 필요');

    const payload: Partial<Idea> = {
      title: title.trim(),
      summary: summary.trim(),
      category: category.trim(),
      targetUser: targetUser.trim(),
      sourcePlatform: source,
      sourceURL: originUrl.trim(),
      heroImageUrl: heroImageUrl.trim() || undefined,
      badges,
      offer: offer.trim() || undefined,
      evidence: {
        keyword: evidence.keyword.trim() || undefined,
        volume: evidence.volume ? Number(evidence.volume) : undefined,
        growthPct: evidence.growthPct ? Number(evidence.growthPct) : undefined,
        chartImg: evidence.chartImg?.trim() || undefined,
      },
      pricing: {
        model: pricing.model,
        tiers: pricing.tiers ? pricing.tiers.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8) : [],
      },
      scorecards: score,
      tags,
      useCases,
      techStack,
      status: 'Pending',
      uploadedAt: new Date().toISOString(),
      koreanizationNotes: [note1, note2, note3].filter(Boolean),
    };

    if (!payload.title) return alert('제목은 필수입니다.');

    await addDoc(collection(db, 'ideas'), payload);
    alert('등록 완료!');

    // 간단 리셋
    setTitle('');
    setSummary('');
    setCategory('');
    setTargetUser('');
    setOriginUrl('');
    setHeroImageUrl('');
    setBadges([]);
    setOffer('');
    setEvidence({ keyword: '', volume: '', growthPct: '', chartImg: '' });
    setPricing({ model: 'subscription', tiers: '' });
    setScore({ opportunity: 7, problem: 7, feasibility: 6, whyNow: 8 });
    setTags([]);
    setUseCases([]);
    setTechStack([]);
    setNote1('');
    setNote2('');
    setNote3('');
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <h2 className="text-center mb-6">Admin 로그인 필요</h2>
        <div className="flex justify-center">
          <button onClick={handleGoogle} className="px-4 py-2 bg-black text-white rounded-md">
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 space-y-4">
        <p>권한이 없습니다. 요청 이메일: <b>{user.email}</b></p>
        <button onClick={handleSignOut} className="px-3 py-2 border rounded-md">
          Sign out
        </button>
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
          <input 
            className="rounded-md border px-3 py-2 sm:col-span-2" 
            placeholder="제목" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />
          <textarea 
            className="rounded-md border px-3 py-2 sm:col-span-2" 
            rows={3} 
            placeholder="요약" 
            value={summary} 
            onChange={e => setSummary(e.target.value)} 
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <input 
              className="rounded-md border px-3 py-2" 
              placeholder="카테고리" 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
            />
            <input 
              className="rounded-md border px-3 py-2" 
              placeholder="Target User" 
              value={targetUser} 
              onChange={e => setTargetUser(e.target.value)} 
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <select 
              className="rounded-md border px-3 py-2" 
              value={source} 
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="ideabrowser">ideabrowser</option>
              <option value="manual">manual</option>
              <option value="crawler">crawler</option>
            </select>
            <input 
              className="rounded-md border px-3 py-2" 
              placeholder="원본 URL" 
              value={originUrl} 
              onChange={e => setOriginUrl(e.target.value)} 
            />
          </div>
        </div>
      </Section>

      {/* Hero & Badges */}
      <Section title="Hero & Badges">
        <input 
          className="w-full rounded-md border px-3 py-2" 
          placeholder="Hero 이미지 URL" 
          value={heroImageUrl} 
          onChange={e => setHeroImageUrl(e.target.value)} 
        />
        <BadgeInput 
          label="Badges" 
          value={badges} 
          onChange={setBadges}
          placeholder="Perfect Timing, Massive Market, etc."
        />
      </Section>

      {/* Offer & Evidence */}
      <Section title="Offer & Evidence">
        <input 
          className="w-full rounded-md border px-3 py-2" 
          placeholder="핵심 한 줄 Offer" 
          value={offer} 
          onChange={e => setOffer(e.target.value)} 
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <input 
            className="rounded-md border px-3 py-2" 
            placeholder="검색 키워드" 
            value={evidence.keyword} 
            onChange={e => setEvidence({ ...evidence, keyword: e.target.value })} 
          />
          <input 
            className="rounded-md border px-3 py-2" 
            placeholder="월 검색량" 
            value={evidence.volume} 
            onChange={e => setEvidence({ ...evidence, volume: e.target.value })} 
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input 
            className="rounded-md border px-3 py-2" 
            placeholder="성장률 (%)" 
            value={evidence.growthPct} 
            onChange={e => setEvidence({ ...evidence, growthPct: e.target.value })} 
          />
          <input 
            className="rounded-md border px-3 py-2" 
            placeholder="차트 이미지 URL" 
            value={evidence.chartImg} 
            onChange={e => setEvidence({ ...evidence, chartImg: e.target.value })} 
          />
        </div>
      </Section>

      {/* Scorecards */}
      <Section title="Scorecards">
        <NumberInput label="Opportunity" value={score.opportunity} onChange={v => setScore({ ...score, opportunity: v })} />
        <NumberInput label="Problem" value={score.problem} onChange={v => setScore({ ...score, problem: v })} />
        <NumberInput label="Feasibility" value={score.feasibility} onChange={v => setScore({ ...score, feasibility: v })} />
        <NumberInput label="Why Now" value={score.whyNow} onChange={v => setScore({ ...score, whyNow: v })} />
      </Section>

      {/* Tags & Use Cases */}
      <Section title="Tags & Use Cases">
        <BadgeInput label="Tags" value={tags} onChange={setTags} placeholder="ai, saas, fintech" />
        <BadgeInput label="Use Cases" value={useCases} onChange={setUseCases} placeholder="small business, enterprise" />
        <BadgeInput label="Tech Stack" value={techStack} onChange={setTechStack} placeholder="react, node, aws" />
      </Section>

      {/* Koreanization Notes */}
      <Section title="한국화 노트">
        <input 
          className="w-full rounded-md border px-3 py-2" 
          placeholder="노트 1" 
          value={note1} 
          onChange={e => setNote1(e.target.value)} 
        />
        <input 
          className="w-full rounded-md border px-3 py-2" 
          placeholder="노트 2" 
          value={note2} 
          onChange={e => setNote2(e.target.value)} 
        />
        <input 
          className="w-full rounded-md border px-3 py-2" 
          placeholder="노트 3" 
          value={note3} 
          onChange={e => setNote3(e.target.value)} 
        />
      </Section>

      <button onClick={handleSubmit} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md">
        등록
      </button>
    </div>
  );
}
