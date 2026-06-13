import { useState } from 'react';
import { useStore } from '../store';
import { SUPPLEMENTS } from '../data/supplements';
import { ActivityRing } from '../components/ActivityRing';
import { SegmentedControl } from '../components/SegmentedControl';
import { SupplementRow } from '../components/SupplementRow';
import { WaterCard } from '../components/WaterCard';
import { SupplementDetail } from './SupplementDetail';
import type { Mode } from '../data/plan';

const MODE_OPTIONS: { id: Mode; label: string }[] = [
  { id: 'padel',    label: 'Тільки падел' },
  { id: 'padelF45', label: 'Падел + F45' },
  { id: 'rest',     label: 'Без спорту' },
];

export function Today() {
  const { day, setMode, toggle, plan, required, progress } = useStore();
  const [detailId, setDetailId] = useState<string | null>(null);

  const get = (id: string) => SUPPLEMENTS.find(s => s.id === id)!;

  if (detailId) {
    const s = get(detailId);
    return (
      <SupplementDetail
        supplement={s as {
          id: string; name: string; fullName: string; brand: string;
          color: string; icon: string; evidence: string; emptyStomachOk: boolean;
          dose: Record<string, string>; benefit: string; duration: string;
          notes: string; cautions: readonly string[];
        }}
        mode={day.mode}
        taken={day.taken.includes(detailId)}
        onToggle={() => toggle(detailId)}
        onBack={() => setDetailId(null)}
      />
    );
  }

  const takenCount = required.filter((id: string) => day.taken.includes(id)).length;
  const remaining = required
    .filter((id: string) => !day.taken.includes(id))
    .map((id: string) => get(id).name);

  const dateStr = new Date().toLocaleDateString('uk-UA', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div className="min-h-screen bg-grouped pb-32">
      <header className="sticky top-0 z-10 px-4 pt-12 pb-3" style={{ background: 'var(--bg-grouped)' }}>
        <h1 className="text-[34px] font-bold leading-tight text-label">Сьогодні</h1>
        <p className="text-[15px] capitalize text-label-secondary">{dateStr}</p>
        <div className="mt-3">
          <SegmentedControl value={day.mode} onChange={setMode} options={MODE_OPTIONS} />
        </div>
      </header>

      {/* Summary ring card */}
      <div className="mx-4 mt-2 flex items-center gap-5 rounded-ios-xl bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <ActivityRing progress={progress} size={108} color="#34C759">
          <div className="text-center">
            <div className="text-[24px] font-bold tabular-nums text-label">{takenCount}/{required.length}</div>
            <div className="text-[11px] text-label-secondary">прийнято</div>
          </div>
        </ActivityRing>
        <div className="flex-1 text-[15px] text-label-secondary leading-snug">
          {remaining.length > 0 ? (
            <>Залишилось:<br /><span className="font-medium text-label">{remaining.join(', ')}</span></>
          ) : (
            <span className="font-semibold text-label">Усе прийнято сьогодні!</span>
          )}
        </div>
      </div>

      {/* Plan sections */}
      {plan.map((section) => (
        <section key={section.slot} className="mt-5">
          <h2 className="mb-1.5 px-4 text-[13px] font-medium uppercase tracking-wide text-label-secondary">
            {section.slot}
          </h2>
          <div className="mx-4 overflow-hidden rounded-ios-xl bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] [&>*+*]:border-t [&>*+*]:border-[var(--separator)]">
            {section.items.map((it) => {
              const s = get(it.id);
              return (
                <SupplementRow
                  key={it.id}
                  name={s.name}
                  dose={s.dose[day.mode]}
                  color={s.color}
                  iconName={s.icon}
                  emptyStomachOk={s.emptyStomachOk}
                  optional={it.optional}
                  taken={day.taken.includes(it.id)}
                  onToggle={() => toggle(it.id)}
                  onOpen={() => setDetailId(it.id)}
                />
              );
            })}
          </div>
        </section>
      ))}

      <WaterCard />
    </div>
  );
}
