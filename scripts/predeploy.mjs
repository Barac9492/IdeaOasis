#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Running predeploy checks...');

// ensure TypeScript deps (if any .ts exists)
import fs from 'node:fs';
const hasTsFiles = !!fs.readdirSync('.', { withFileTypes: true })
  .some(function scan(dirent) {
    const name = dirent.name;
    if (dirent.isDirectory() && !['node_modules', '.next', 'dist', '.vercel'].includes(name)) {
      return fs.readdirSync(name, { withFileTypes: true }).some(d => scan({
        isDirectory: () => d.isDirectory(),
        name: `${name}/${d.name}`,
      }));
    }
    return name.endsWith('.ts') || name.endsWith('.tsx');
  });

if (hasTsFiles) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dev = pkg.devDependencies || {};
  if (!dev.typescript || !dev['@types/react'] || !dev['@types/node']) {
    console.log('⚠️  Missing TS devDeps. Please run: npm i -D typescript @types/react @types/node');
    process.exit(1);
  }
  console.log('✅ TypeScript dependencies verified');
}

// 1. 필수 파일 존재 확인
const requiredFiles = [
  'lib/firebase.js',
  'lib/firebaseAdmin.ts',
  'tsconfig.json'
];

const missingFiles = [];
for (const file of requiredFiles) {
  if (!existsSync(file)) {
    missingFiles.push(file);
  }
}

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles);
  process.exit(1);
}

console.log('✅ All required files exist');

// 2. tsconfig.json 경로 별칭 확인
try {
  const tsconfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'));
  const paths = tsconfig.compilerOptions?.paths;
  
  if (!paths || !paths['@/*']) {
    console.error('❌ Path alias @/* not found in tsconfig.json');
    process.exit(1);
  }
  
  console.log('✅ Path aliases configured correctly');
} catch (error) {
  console.error('❌ Error reading tsconfig.json:', error.message);
  process.exit(1);
}

// 3. jsconfig.json 생성 (TypeScript가 아닌 경우를 대비)
if (!existsSync('jsconfig.json')) {
  const jsconfig = {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./*"]
      }
    }
  };
  
  writeFileSync('jsconfig.json', JSON.stringify(jsconfig, null, 2));
  console.log('✅ Created jsconfig.json');
}

// 4. .env.sample 파일 생성 (환경변수 가이드)
const envSample = `# Firebase Client SDK (클라이언트)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com

# Firebase Admin SDK (서버 - Ingest API용)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"

# Ingest API Token
INGEST_TOKEN=your_ingest_token_here
`;

if (!existsSync('.env.sample')) {
  writeFileSync('.env.sample', envSample);
  console.log('✅ Created .env.sample');
}

// 5. 빌드 테스트
console.log('🔨 Testing build process...');
try {
  const { execSync } = await import('child_process');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build test successful');
} catch (error) {
  console.error('❌ Build test failed');
  process.exit(1);
}

console.log('🎉 All predeploy checks passed!');
