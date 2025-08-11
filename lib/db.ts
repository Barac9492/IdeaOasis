// lib/db.ts
import type { Idea } from './types';

const inMemory: Idea[] = [];

const useFirestore = !!process.env.NEXT_PUBLIC_USE_FIRESTORE;

export async function listIdeas(): Promise<Idea[]> {
  if (!useFirestore) return inMemory.filter(i => i.visible !== false);
  // TODO: Firestore 연결 시 여기로 교체
  return inMemory;
}

export async function getIdea(id: string): Promise<Idea | null> {
  if (!useFirestore) return inMemory.find(i => i.id === id) ?? null;
  return inMemory.find(i => i.id === id) ?? null;
}

export async function upsertIdeas(bulk: Idea[]): Promise<number> {
  let count = 0;
  for (const it of bulk) {
    const idx = inMemory.findIndex(x => x.id === it.id);
    if (idx >= 0) {
      inMemory[idx] = { ...inMemory[idx], ...it, updatedAt: new Date().toISOString() };
    } else {
      inMemory.push({ 
        ...it, 
        visible: it.visible !== undefined ? it.visible : true,
        createdAt: it.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    count++;
  }
  return count;
}

export async function createIdea(manual: Omit<Idea, 'id'>): Promise<Idea> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const idea: Idea = { id, createdAt: now, updatedAt: now, visible: true, ...manual };
  inMemory.unshift(idea);
  return idea;
}

export async function updateIdea(id: string, updates: Partial<Idea>): Promise<Idea | null> {
  const idx = inMemory.findIndex(x => x.id === id);
  if (idx >= 0) {
    inMemory[idx] = { ...inMemory[idx], ...updates, updatedAt: new Date().toISOString() };
    return inMemory[idx];
  }
  return null;
}
