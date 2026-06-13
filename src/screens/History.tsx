import { Flame } from 'lucide-react';
import { useStore, dateKey } from '../store';
import { DAILY_PLAN } from '../data/plan';
import type { Mode } from '../data/plan';
import { ActivityRing } from '../components/ActivityRing';

type DayLog = { mode: Mode; taken: string[] };

function calcStreak(logs: Record<string, DayLog>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const log = logs[key];
    if (!log) {
      if (i === 0) continue;
      break;
    }
    const plan = DAILY_PLAN[log.mode];
    const required = (plan as unknown as { slot: string; items: { id: string; optional?: boolean }[] }[])
      .flatMap(s => s.items.filter(x => !x.optional).map(x => x.id));
    if (!required.length) {
      if (i === 0) continue;
      break;
    }
    const ratio = log.taken.filter(id => required.includes(id)).length / required.length;
    if (ratio >= 0.8) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}

function getPct(log: DayLog | undefined): number | null {
  if (!log) return null;
  const plan = DAILY_PLAN[log.mode];
  const required = (plan as unknown as { slot: string; items: { id: string; optional?: boolean }[] }[])
    .flatMap(s => s.items.filter(x => !x.optional).map(x => x.id));
  if (!required.length) return null;
  return log.taken.filter(id => required.includes(id)).length / required.length;
}

function ringColor(pct: number): string {
  if (pct >= 0.8) return '#34C759';
  if (pct >= 0.5) return '#FFCC00';
  return '#FF3B30';
}

function RecentDays({ logs }: { logs: Record<string, DayLog> }) {
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    const key = dateKey(d);
    const pct = getPct(logs[key]);
    return { d, key, pct, isToday: i === 13 };
  });

  return (
    <div className="overflow-x-auto -mx-4">
      <div className="flex gap-2 px-4 pb-1" style={{ minWidth: 'max-content' }}>
        {days.map(({ d, key, pct, isToday }) => {
          const color = pct !== null ? ringColor(pct) : 'rgba(120,120,128,0.25)';
          const track = pct !== null ? `${color}26` : 'rgba(120,120,128,0.10)';
          const label = d.toLocaleDateString('uk-UA', { weekday: 'short' });
          const dayNum = d.getDate();
          return (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <ActivityRing
                progress={pct ?? 0}
                size={56}
                stroke={6}
                color={color}
                track={track}
              >
                <span className="text-[10px] font-bold tabular-nums" style={{ color: pct !== null ? 'var(--label)' : 'var(--label-tertiary)' }}>
                  {pct !== null ? `${Math.round(pct * 100)}%` : '—'}
                </span>
              </ActivityRing>
              <span
                className="text-[10px] font-semibold"
                style={{ color: isToday ? 'var(--tint)' : 'var(--label-secondary)' }}
              >
                {label}
              </span>
              <span
                className="text-[10px]"
                style={{ color: isToday ? 'var(--tint)' : 'var(--label-tertiary)' }}
              >
                {dayNum}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthCalendar({ logs }: { logs: Record<string, DayLog> }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(wd => (
          <div key={wd} className="text-center text-[11px] text-label-secondary">{wd}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[5px]">
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const d = new Date(year, month, day);
          const key = dateKey(d);
          const pct = getPct(logs[key]);
          const isToday = day === today.getDate();
          const future = d > today;

          return (
            <div key={day} className="flex flex-col items-center gap-0.5">
              <ActivityRing
                progress={!future && pct !== null ? pct : 0}
                size={36}
                stroke={4}
                color={pct !== null ? ringColor(pct) : 'rgba(120,120,128,0.2)'}
                track={future ? 'rgba(120,120,128,0.06)' : (pct !== null ? `${ringColor(pct)}22` : 'rgba(120,120,128,0.10)')}
              >
                <span
                  className="text-[9px] font-semibold tabular-nums"
                  style={{
                    color: isToday ? 'var(--tint)' : pct !== null ? 'var(--label)' : 'var(--label-tertiary)',
                  }}
                >
                  {day}
                </span>
              </ActivityRing>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3">
        {([['#34C759', '≥80%'], ['#FFCC00', '50–79%'], ['#FF3B30', '<50%']] as [string, string][]).map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5 text-[11px] text-label-secondary">
            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function streakLabel(n: number): string {
  if (n === 1) return 'день';
  if (n >= 2 && n <= 4) return 'дні';
  return 'днів';
}

export function History() {
  const { state } = useStore();
  const logs = state.logs as Record<string, DayLog>;
  const streak = calcStreak(logs);
  const hasData = Object.keys(logs).length > 0;

  if (!hasData) {
    return (
      <div className="min-h-screen bg-grouped pb-32 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <Flame size={64} color="rgba(120,120,128,0.3)" />
        <h2 className="text-[22px] font-bold text-label">Ще немає даних</h2>
        <p className="text-[15px] text-label-secondary">Почни відмічати добавки сьогодні — тут з'явиться твоя статистика.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grouped pb-32">
      <header className="sticky top-0 z-10 px-4 pt-12 pb-3" style={{ background: 'var(--bg-grouped)' }}>
        <h1 className="text-[34px] font-bold text-label">Історія</h1>
      </header>

      <div className="px-4 space-y-4">
        {/* Streak card */}
        <div className="rounded-ios-xl bg-card p-5 flex items-center gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="grid h-14 w-14 place-items-center rounded-[16px]" style={{ background: 'rgba(255,149,0,.15)' }}>
            <Flame size={30} color="#FF9500" />
          </div>
          <div>
            <div className="text-[28px] font-bold tabular-nums text-label">{streak} {streakLabel(streak)}</div>
            <div className="text-[15px] text-label-secondary">серія поспіль</div>
          </div>
        </div>

        {/* Recent 14 days as rings */}
        <div className="rounded-ios-xl bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="text-[17px] font-semibold text-label mb-4">Останні 14 днів</h2>
          <RecentDays logs={logs} />
        </div>

        {/* Month calendar as rings */}
        <div className="rounded-ios-xl bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="text-[17px] font-semibold text-label mb-3">
            {new Date().toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })}
          </h2>
          <MonthCalendar logs={logs} />
        </div>
      </div>
    </div>
  );
}
