// scripts/predeploy.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const exists = (p) => fs.existsSync(path.join(root, p));
const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const writeJSON = (p, obj) => fs.writeFileSync(path.join(root, p), JSON.stringify(obj, null, 2) + '\n');

const REQUIRED_PUBLIC = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'NEXT_PUBLIC_ADMIN_EMAILS',
];
const REQUIRED_SERVER = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'INGEST_TOKEN',
];

function parseDotEnv(file) {
  if (!exists(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(path.join(root, file), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, '');
  }
  return out;
}

function ensureAlias() {
  const ts = 'tsconfig.json';
  const js = 'jsconfig.json';
  const target = exists(ts) ? ts : (exists(js) ? js : null);
  if (target) {
    const cfg = readJSON(target);
    cfg.compilerOptions ??= {};
    cfg.compilerOptions.baseUrl = '.';
    cfg.compilerOptions.paths ??= {};
    cfg.compilerOptions.paths['@/*'] = ['./*'];
    writeJSON(target, cfg);
    console.log(`✅ Updated ${target} with @/* alias`);
  } else {
    writeJSON('jsconfig.json', { compilerOptions: { baseUrl: '.', paths: { '@/*': ['./*'] } } });
    console.log('✅ Created jsconfig.json with @/* alias');
  }
}

function ensureLibFiles() {
  fs.mkdirSync(path.join(root, 'lib'), { recursive: true });
  if (!exists('lib/firebase.js')) {
    fs.writeFileSync(path.join(root, 'lib/firebase.js'), `import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
`);
    console.log('✅ Created lib/firebase.js');
  }
  if (!exists('lib/firebaseAdmin.ts')) {
    fs.writeFileSync(path.join(root, 'lib/firebaseAdmin.ts'), `import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
let app: App;
if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID!;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\\n');
  if (!projectId || !clientEmail || !privateKey) throw new Error('Missing FIREBASE_* admin credentials in env');
  app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
} else {
  app = getApps()[0]!;
}
export const adminDb = getFirestore(app);
`);
    console.log('✅ Created lib/firebaseAdmin.ts');
  }
}

function ensureEnvSample() {
  const have = parseDotEnv('.env.local');
  const missingPublic = REQUIRED_PUBLIC.filter((k) => !(k in have));
  const missingServer = REQUIRED_SERVER.filter((k) => !(k in have));

  let sample = '';
  for (const k of REQUIRED_PUBLIC) sample += `${k}=${have[k] ?? ''}\n`;
  for (const k of REQUIRED_SERVER) sample += `${k}=${have[k] ?? (k === 'INGEST_TOKEN' ? 'ideaoasis_ingest_XXXX' : '')}\n`;
  fs.writeFileSync(path.join(root, '.env.sample'), sample);
  console.log('✅ Wrote .env.sample');

  if (missingPublic.length || missingServer.length) {
    console.log('⚠️  Missing in .env.local:');
    if (missingPublic.length) console.log('   - Public:', missingPublic.join(', '));
    if (missingServer.length) console.log('   - Server:', missingServer.join(', '));
  } else {
    console.log('✅ All required .env.local keys present');
  }
}

function tryBuild() {
  try {
    console.log('🏗  Running: next build');
    execSync('npx next build', { stdio: 'inherit' });
    console.log('✅ next build succeeded');
  } catch (e) {
    console.log('❌ next build failed. Fix tips:\n' +
      '- Ensure @ alias (js/tsconfig)\n' +
      '- Ensure lib/firebase.js & lib/firebaseAdmin.ts exist\n' +
      '- Ensure .env.local keys (see .env.sample)\n' +
      '- After adding jsconfig/tsconfig, restart dev server\n');
    process.exit(1);
  }
}

ensureAlias();
ensureLibFiles();
ensureEnvSample();
tryBuild();