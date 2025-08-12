// lib/db.ts
import type { Idea } from './types';

// Import the seed data directly
let inMemory: Idea[] = [];
let isSeeded = false;

// Function to reset seeding state (useful for development)
export function resetSeeding(): void {
  inMemory.length = 0;
  isSeeded = false;
}

const useFirestore = !!process.env.NEXT_PUBLIC_USE_FIRESTORE;

// Auto-seed function
async function ensureSeeded(): Promise<void> {
  if (isSeeded) return;
  
  try {
    // Import seed data dynamically to avoid circular dependency
    const { realBusinessIdeas } = await import('./seedData');
    
    // Use seed data directly (removed enhancement for regulatory compliance focus)
    const enhancedIdeas = realBusinessIdeas;
    
    await upsertIdeas(enhancedIdeas);
    isSeeded = true;
    console.log(`Database seeded: ${enhancedIdeas.length} business ideas for regulatory compliance analysis`);
  } catch (error) {
    console.warn('Failed to auto-seed database:', error);
  }
}

export async function listIdeas(): Promise<Idea[]> {
  await ensureSeeded();
  if (!useFirestore) return inMemory.filter(i => i.visible !== false);
  // TODO: Firestore 연결 시 여기로 교체
  return inMemory;
}

export async function getIdea(id: string): Promise<Idea | null> {
  await ensureSeeded();
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
