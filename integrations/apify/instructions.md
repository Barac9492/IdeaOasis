# Apify → IdeaOasis 데이터 파이프라인 설정 가이드

## 웹훅 방식 (권장)

### 1. Apify Console에서 웹훅 설정

1. **Apify Console** → **Actors** → **당신의 크롤러** 선택
2. **Webhooks** 탭 → **Add webhook**
3. 설정:
   - **Event**: `ACTOR.RUN.SUCCEEDED`
   - **Request URL**: `https://idea-oasis.vercel.app/api/ingest-bulk`
   - **Method**: `POST`
   - **Headers**:
     ```
     Content-Type: application/json
     X-Ingest-Token: ${INGEST_TOKEN}
     ```
   - **Payload template**: `Run dataset items` (선택)
   - **Custom payload** (위 옵션이 없다면): `{{json @dataset.items}}`

### 2. INGEST_TOKEN 설정

**Apify Console** → **Integrations** → **Secrets**:
- **Name**: `INGEST_TOKEN`
- **Value**: `ideaoasis_ingest_6f2c1a9f8eab47e6b3d2c45f9d7a1c84`

### 3. 데이터 매핑

Apify에서 나오는 데이터가 다음 필드로 자동 매핑됩니다:

```javascript
// Apify → IdeaOasis 매핑
{
  title: it.title || it.h1 || it.heading || '',
  summary: it.summary || it.description || '',
  category: it.category || 'Uncategorized',
  targetUser: it.targetUser || it.audience || '',
  businessModel: it.businessModel || it.model || '',
  koreaFitScore: it.koreaFitScore ?? it.koreaFit ?? 3,
  sourceURL: it.sourceURL || it.url || '',
  sourcePlatform: it.sourcePlatform || it.source || 'apify',
  uploadedAt: new Date().toISOString(),
  adminReview: it.adminReview || '',
  status: it.status || 'Pending',
  // 확장 필드
  offer: it.offer || '',
  badges: it.badges || [],
  tags: it.tags || it.keywords || [],
  useCases: it.useCases || [],
  techStack: it.techStack || [],
  scorecards: it.scorecards || { opportunity: 0, problem: 0, feasibility: 0, whyNow: 0 },
  evidence: it.evidence || null,
  pricing: it.pricing || null,
  heroImage: it.heroImage || it.image || '',
}
```

### 4. 제한사항

- **바디 크기 제한**: ~4.5MB (Vercel 제한)
- **권장 아이템 수**: ≤50개 per run
- **중복 제거**: `sourceURL` 기준으로 자동 업서트

### 5. 모니터링

- **Vercel**: Functions → `/api/ingest-bulk` 로그 확인
- **Apify**: Runs → Webhooks 탭 → Delivery status 확인
- **Firestore**: Console → ideas 컬렉션에서 데이터 확인

## Actor 코드 방식 (대안)

아이템 수가 많거나 필드 변환이 필요한 경우:

```javascript
// Actor 런 종료 직전에 추가
async function pushToIdeaOasis() {
  const { items } = await Dataset.getData();
  if (!items?.length) return;

  // 필드 매핑
  const mapped = items.map((it: any) => ({
    title: it.title || it.h1 || it.heading || '',
    summary: it.summary || it.description || '',
    category: it.category || 'Uncategorized',
    targetUser: it.targetUser || it.audience || '',
    businessModel: it.businessModel || it.model || '',
    koreaFitScore: it.koreaFitScore ?? it.koreaFit ?? 3,
    sourceURL: it.sourceURL || it.url || '',
    sourcePlatform: it.sourcePlatform || it.source || 'apify',
    uploadedAt: new Date().toISOString(),
    adminReview: it.adminReview || '',
    status: it.status || 'Pending',
    offer: it.offer || '',
    badges: it.badges || [],
    tags: it.tags || it.keywords || [],
    useCases: it.useCases || [],
    techStack: it.techStack || [],
    scorecards: it.scorecards || { opportunity: 0, problem: 0, feasibility: 0, whyNow: 0 },
    evidence: it.evidence || null,
    pricing: it.pricing || null,
    heroImage: it.heroImage || it.image || '',
  })).filter(r => r.sourceURL);

  // 50개 단위로 청크 업서트
  const chunkSize = 50;
  for (let i = 0; i < mapped.length; i += chunkSize) {
    const chunk = mapped.slice(i, i + chunkSize);
    const res = await fetch('https://idea-oasis.vercel.app/api/ingest-bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ingest-Token': process.env.INGEST_TOKEN!,
      },
      body: JSON.stringify(chunk),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      await Actor.log.error(`ingest-bulk failed: ${res.status} ${txt}`);
    }
  }
}

// 런 종료 직전 호출
await pushToIdeaOasis();
```

## 백필 스크립트

기존 JSON 데이터를 일괄 업로드:

```bash
# 로컬 JSON 배열(ideas.json) → 50개씩 쪼개 전송
node -e "
const fs=require('fs');
const ideas=JSON.parse(fs.readFileSync('ideas.json','utf8'));
const chunk=(a,n)=>Array.from({length:Math.ceil(a.length/n)},(_,i)=>a.slice(i*n,(i+1)*n));
const arr=chunk(ideas,50);
(async()=>{
 for(const c of arr){
  const r=await fetch('https://idea-oasis.vercel.app/api/ingest-bulk',{
   method:'POST',
   headers:{'Content-Type':'application/json','X-Ingest-Token':'ideaoasis_ingest_6f2c1a9f8eab47e6b3d2c45f9d7a1c84'},
   body:JSON.stringify(c),
  });
  console.log('chunk', r.status);
 }
})();"
```
