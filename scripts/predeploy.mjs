#!/usr/bin/env node

import fs from "node:fs";

console.log("🔍 Running predeploy checks...");

const mustFiles = [
  "app/api/ingest/route.ts",
  "lib/firebaseAdmin.ts",
  "jsconfig.json",
];

const missing = mustFiles.filter((p) => !fs.existsSync(p));
if (missing.length) {
  console.error("❌ Missing files:", missing);
  process.exit(1);
}

const requiredEnv = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "INGEST_TOKEN",
];

const missingEnv = requiredEnv.filter((k) => !process.env[k]);
if (missingEnv.length) {
  console.warn("⚠️ Missing env at build-time (check Vercel Project Settings):", missingEnv);
}

console.log("✅ Predeploy checks passed");

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
