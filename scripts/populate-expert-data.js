// Script to populate expert network data for testing
const koreanExperts = [
  {
    id: 'expert-001',
    name: '김철수',
    title: '전 삼성벤처스 대표',
    expertise: ['벤처투자', 'AI/ML', '전략기획'],
    experience: '15년+ 벤처투자 경험, 100개+ 스타트업 투자',
    rating: 4.9,
    hourlyRate: 300000,
    availability: 'available',
    bio: '삼성벤처스에서 15년간 근무하며 AI/ML 분야 전문 투자자로 활동. 국내외 100개 이상의 스타트업에 투자 및 멘토링 경험.',
    specialties: ['Series A 투자 전략', 'AI 기술 평가', '글로벌 진출 전략'],
    portfolio: ['쿠팡', '배달의민족', '토스'],
    education: 'MIT MBA, 서울대 전기공학',
    languages: ['한국어', '영어', '중국어']
  },
  {
    id: 'expert-002', 
    name: '박영희',
    title: '前 네이버 VP, 現 독립 컨설턴트',
    expertise: ['플랫폼', '프로덕트', '사용자경험'],
    experience: '네이버 12년, 카카오 5년 프로덕트 및 플랫폼 개발',
    rating: 4.8,
    hourlyRate: 250000,
    availability: 'available',
    bio: '네이버에서 12년, 카카오에서 5년 동안 대규모 플랫폼 서비스 개발을 이끌었습니다. 월 1억+ 사용자 서비스 런칭 경험.',
    specialties: ['플랫폼 아키텍처', 'B2C 프로덕트', '사용자 경험 설계'],
    portfolio: ['네이버 검색', '카카오톡', '카카오페이'],
    education: 'KAIST 컴퓨터공학 박사',
    languages: ['한국어', '영어', '일본어']
  },
  {
    id: 'expert-003',
    name: '이민수',
    title: '법무법인 광장 파트너',
    expertise: ['법무', '규제', 'IPO'],
    experience: '15년+ 스타트업 법무 및 IPO 전문',
    rating: 4.7,
    hourlyRate: 400000,
    availability: 'busy',
    bio: '국내 주요 스타트업 IPO와 M&A를 담당한 법무 전문가. 특히 핀테크, 헬스테크 분야 규제 대응 경험 풍부.',
    specialties: ['IPO 준비', '규제 해석', '투자계약서'],
    portfolio: ['크래프톤 IPO', '카카오뱅크 인허가', '토스 투자유치'],
    education: '서울대 법학과, 하버드 로스쿨 LLM',
    languages: ['한국어', '영어']
  },
  {
    id: 'expert-004',
    name: '정다은',
    title: '前 쿠팡 마케팅 디렉터',
    expertise: ['마케팅', '브랜딩', '그로스해킹'],
    experience: '쿠팡 5년, 우버 3년 그로스 마케팅',
    rating: 4.9,
    hourlyRate: 200000,
    availability: 'available',
    bio: '쿠팡에서 MAU 1000만 달성을 이끈 그로스 마케팅 전문가. 데이터 기반 마케팅과 브랜딩 전략에 특화.',
    specialties: ['퍼포먼스 마케팅', '브랜드 전략', '데이터 분석'],
    portfolio: ['쿠팡 MAU 10배 성장', '우버이츠 한국 런칭', '다양한 D2C 브랜드'],
    education: '연세대 경영학과, 스탠포드 MBA',
    languages: ['한국어', '영어']
  },
  {
    id: 'expert-005',
    name: '강태호',
    title: 'KB인베스트먼트 상무',
    expertise: ['기업금융', 'M&A', '밸류에이션'],
    experience: '20년+ 투자은행 및 기업금융 경험',
    rating: 4.6,
    hourlyRate: 350000,
    availability: 'limited',
    bio: 'KB인베스트먼트에서 대형 M&A와 기업금융 업무를 담당. 특히 중견기업 성장 투자와 밸류에이션 전문.',
    specialties: ['기업 밸류에이션', 'M&A 자문', '성장 투자'],
    portfolio: ['30건+ M&A 자문', '500억+ 투자 집행', '다수 중견기업 IPO'],
    education: '서울대 경영대학, 와튼스쿨 MBA',
    languages: ['한국어', '영어']
  }
];

console.log('Korean Expert Network Data:');
console.log(JSON.stringify(koreanExperts, null, 2));

// Test API endpoint for storing expert data
const testExpertAPI = async () => {
  try {
    for (const expert of koreanExperts) {
      const response = await fetch('http://localhost:3000/api/experts/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expert)
      });
      
      if (response.ok) {
        console.log(`✅ Expert ${expert.name} stored successfully`);
      } else {
        console.log(`❌ Failed to store expert ${expert.name}`);
      }
    }
  } catch (error) {
    console.log('Error storing expert data:', error);
  }
};

if (typeof window === 'undefined') {
  // Node.js environment
  testExpertAPI();
}