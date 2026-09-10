'use server';
// ⛔ LOCAL TEST PAGE — NEVER COMMITTED. Step 3's REAL `saveStoryArrangement`, against the stand-in.
import { saveStoryArrangement, type SaveArrangementResult } from '@/lib/story-arrangement-store';
import { standIn, store } from './store';

export async function harnessSave(
  eventId: string,
  arrangement: unknown,
  expectedVersion: number,
): Promise<SaveArrangementResult> {
  return saveStoryArrangement(standIn(), { eventId, input: arrangement, expectedVersion });
}

export async function harnessPeek(): Promise<{ version: number; saves: number; doc: unknown }> {
  const s = store();
  return { version: s.row.arrangement_version, saves: s.saves, doc: s.row.arrangement };
}
