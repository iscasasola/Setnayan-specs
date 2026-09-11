// ⛔ LOCAL TEST PAGE — NEVER COMMITTED. The real <MakeItYours>, fed by step 3's REAL read
// (`loadStoryArrangement`) through the real shaping (`makeItYoursInputFrom`), against a stand-in.
import { loadStoryArrangement } from '@/lib/story-arrangement-store';
import { belongsToThisEvent, NOBODY } from '@/app/[slug]/_lib/belongs-to-this-event';
import { MakeItYours } from '@/app/dashboard/[eventId]/story/_components/make-it-yours';
import { makeItYoursInputFrom } from '@/app/dashboard/[eventId]/story/_lib/load-make-it-yours';
import { harnessSave } from './actions';
import { EVENT, resetStore, standIn, store } from './store';

export const dynamic = 'force-dynamic';

export default async function Harness({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const q = await searchParams;
  if (q.reset !== undefined) {
    resetStore({ noSchedule: q.noschedule !== undefined, unreadable: q.unreadable !== undefined });
  }
  const loaded = await loadStoryArrangement(standIn(), EVENT, {
    isHost: true,
    belongsToEvent: belongsToThisEvent(NOBODY),
  });
  const input = await makeItYoursInputFrom(loaded, async (key) => {
    const n = key.match(/story-step4-fixture\/(\d+)/)?.[1] ?? '1';
    return `https://fixture.r2.cloudflarestorage.com/setnayan-media/story-step4-fixture/${n}.svg?X-Amz-Signature=stub`;
  });
  return (
    <div className="mx-auto max-w-[1010px] px-4 py-8 sm:px-6 lg:px-8">
      <p data-harness-version={store().row.arrangement_version} className="mb-4 text-xs text-ink/60">
        local test page · version {store().row.arrangement_version}
      </p>
      {/* what the stand-in store holds, for the drive to compare with what is drawn */}
      <pre hidden data-harness-doc={JSON.stringify(store().row.arrangement)} />
      {/* the Story Maker's own column: the rail takes 214px + a 28px gap at ≥1000px */}
      <div className="min-[1000px]:grid min-[1000px]:grid-cols-[214px_minmax(0,1fr)] min-[1000px]:gap-7">
        <aside className="hidden min-[1000px]:block" />
        <div className="space-y-6">
          <MakeItYours eventId={EVENT} input={input} save={harnessSave} />
          <div className="h-[600px] rounded-2xl border border-ink/10 p-4 text-sm text-ink/60">
            (the shipped editor&rsquo;s sections continue below)
          </div>
        </div>
      </div>
    </div>
  );
}
