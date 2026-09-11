// ⛔ LOCAL TEST PAGE — NEVER COMMITTED (listed in .git/info/exclude).
// A stand-in for the admin client, answering step 3's REAL read and REAL save from memory, so
// the real <MakeItYours> can be driven in a browser without the production service role.
import type { SupabaseClient } from '@supabase/supabase-js';

type Row = { arrangement: unknown; arrangement_version: number; status: string };
type Store = { row: Row; noSchedule: boolean; unreadable: boolean; saves: number };

const g = globalThis as unknown as { __mky?: Store };
export function store(): Store {
  g.__mky ??= {
    row: { arrangement: null, arrangement_version: 0, status: 'draft' },
    noSchedule: false,
    unreadable: false,
    saves: 0,
  };
  return g.__mky;
}
export function resetStore(opts: { noSchedule?: boolean; unreadable?: boolean } = {}) {
  g.__mky = {
    row: { arrangement: null, arrangement_version: 0, status: 'draft' },
    noSchedule: !!opts.noSchedule,
    unreadable: !!opts.unreadable,
    saves: 0,
  };
}

export const EVENT = '0ccc7aa3-3a81-43ee-b170-afb194e0b259';
export const REF = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

// The test celebration's real run of show (wall clock in a timestamptz, like prod).
const BLOCKS = [
  ['S89K-PY8WEKP1X9', 'Hair & make-up', '2026-08-01T08:00:00+00:00'],
  ['S89K-F6ESPNNV26', 'Cocktails', '2026-08-01T17:00:00+00:00'],
  ['S89K-DNV5DHCNYC', 'Grand Entrance', '2026-08-01T18:15:00+00:00'],
  ['S89K-NMQ31BJC5N', 'Dinner', '2026-08-01T18:45:00+00:00'],
  ['S89K-THWC9G6AJJ', 'First Dance', '2026-08-01T20:00:00+00:00'],
  ['S89K-KGD89VC2Y1', 'Money Dance', '2026-08-01T20:20:00+00:00'],
  ['S89K-R6AN3AGR1D', 'Last Song & Send-off', '2026-08-01T21:45:00+00:00'],
];
// The same ten captures seeded on the test celebration in prod (8 photos, 2 snippets).
const CAPTURES: Array<[number, string, 'photo' | 'clip']> = [
  [1, '2026-08-01T04:10:00Z', 'photo'], [2, '2026-08-01T09:05:00Z', 'photo'],
  [3, '2026-08-01T09:30:00Z', 'clip'], [4, '2026-08-01T10:20:00Z', 'photo'],
  [5, '2026-08-01T10:50:00Z', 'photo'], [6, '2026-08-01T11:05:00Z', 'photo'],
  [7, '2026-08-01T12:05:00Z', 'clip'], [8, '2026-08-01T12:25:00Z', 'photo'],
  [9, '2026-08-01T12:40:00Z', 'photo'], [10, '2026-08-01T13:50:00Z', 'photo'],
];
const papicRows = () =>
  CAPTURES.map(([n, at, type]) => ({
    photo_id: REF(n),
    photo_type: type,
    captured_at: at,
    r2_object_key: `story-step4-fixture/${n}.${type === 'clip' ? 'mp4' : 'jpg'}`,
    display_r2_key: `story-step4-fixture/${n}-display.jpg`,
    thumb_r2_key: `story-step4-fixture/${n}-thumb.jpg`,
    poster_r2_key: type === 'clip' ? `story-step4-fixture/${n}-poster.jpg` : null,
    clip_web_r2_key: type === 'clip' ? `story-step4-fixture/${n}-web.mp4` : null,
    full_res_dropped_at: null,
    moderation_state: 'clean',
  }));

type Call = { table: string; ops: Array<[string, unknown[]]> };
const has = (c: Call, op: string) => c.ops.some(([m]) => m === op);

function answer(c: Call): { data: unknown; error: unknown } {
  const s = store();
  if (c.table === 'guests') return { data: [], error: null };
  if (c.table === 'photo_tags') return { data: [], error: null };
  if (c.table === 'papic_photos') {
    if (s.unreadable) return { data: null, error: { message: 'refused' } };
    if (has(c, 'or')) return { data: [], error: null };
    const inOp = c.ops.find(([m, a]) => m === 'in' && a[0] === 'photo_id');
    const rows = papicRows();
    if (inOp) {
      const ids = new Set((inOp[1][1] as string[]).map((x) => x.toLowerCase()));
      return { data: rows.filter((r) => ids.has(r.photo_id)), error: null };
    }
    return { data: rows, error: null };
  }
  if (c.table === 'event_editorial') return { data: { ...s.row }, error: null };
  if (c.table === 'events') return { data: { event_date: '2026-08-01', event_end_date: null }, error: null };
  if (c.table === 'event_schedule_blocks') {
    if (s.noSchedule) return { data: [], error: null };
    return {
      data: BLOCKS.map(([public_id, label, start_at], i) => ({ public_id, label, start_at, sort_order: i })),
      error: null,
    };
  }
  return { data: null, error: null };
}

/** jsonb equality: key order does not matter. */
function canon(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canon).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v as object)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canon((v as Record<string, unknown>)[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(v);
}

/** `save_story_arrangement`, as the migration writes it: compare-and-set on the version. */
function rpc(name: string, args: { p_expected: number; p_doc: unknown }) {
  const s = store();
  if (name !== 'save_story_arrangement') return { data: null, error: { message: 'no rpc' } };
  if (s.row.arrangement_version === args.p_expected) {
    s.row = { ...s.row, arrangement: args.p_doc, arrangement_version: s.row.arrangement_version + 1 };
    s.saves += 1;
    return { data: [{ outcome: 'saved', saved_version: s.row.arrangement_version }], error: null };
  }
  if (canon(s.row.arrangement) === canon(args.p_doc)) {
    return { data: [{ outcome: 'unchanged', saved_version: s.row.arrangement_version }], error: null };
  }
  return { data: [{ outcome: 'conflict', saved_version: s.row.arrangement_version }], error: null };
}

export function standIn(): SupabaseClient {
  const api = {
    from(table: string) {
      const call: Call = { table, ops: [] };
      const chain: Record<string, unknown> = {};
      for (const m of ['select', 'eq', 'neq', 'is', 'in', 'gte', 'lte', 'lt', 'order', 'limit', 'not', 'or']) {
        chain[m] = (...a: unknown[]) => {
          call.ops.push([m, a]);
          return chain;
        };
      }
      chain.maybeSingle = async () => {
        const r = answer(call);
        return { data: Array.isArray(r.data) ? (r.data[0] ?? null) : r.data, error: r.error };
      };
      chain.then = (resolve: (v: unknown) => unknown) => resolve(answer(call));
      return chain;
    },
    async rpc(name: string, args: { p_expected: number; p_doc: unknown }) {
      return rpc(name, args);
    },
  };
  return api as unknown as SupabaseClient;
}
