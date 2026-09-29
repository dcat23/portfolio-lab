import { memoryVisitorStore } from './memory-store';
import type { VisitorStore } from './types';

// Single swap point. Point this at a real backend later without touching
// any call site — see the note in memory-store.ts.
export const visitorStore: VisitorStore = memoryVisitorStore;

export type { VisitorRecord, VisitorStore, ReferrerCategory } from './types';
