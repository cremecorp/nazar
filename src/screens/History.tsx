import { Flame } from 'lucide-react';
import { useStore } from '../store';
import { DAILY_PLAN } from '../data/plan';
import type { Mode } from '../data/plan';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

type DayLog = { mode: Mode; taken: string[] };

function calcStreak(logs: Record<string, DayLog>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const log = logs[key];
    // Today might not be logged yet — skip it without breaking the streak
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
      // Today is still in progress — don't break, but don't count it
      continue;
    } else {
      break;
    }
  }
  return streak;
}

function getAdherence(logs: Record<string, DayLog>, days: number) {
  const result = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const log = logs[key];
    let pct = 0;
    if (log) {
      const plan = DAILY_PLAN[log.mode];
      const required = (plan as unknown as { slot: string; items: { id: string; optional?: boolean }[] }[])
        .flatMap(s => s.items.filter(x => !x.optional).map(x => x.id));
      pct = required.length
        ? Math.round((log.taken.filter(id => required.includes(id)).length / required.length) * 100)
        : 0;
    }
    result.push({ day: d.toLocaleDateString('uk-UA', { weekday: 'short' }), pct });
  }
  return result;
}

function CalendarHeatmap({ logs }: { logs: Record<string, DayLog> }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;

  function getPct(day: number): number | null {
    const d = new Date(year, month, day);
    const key = d.toISOString().slice(0, 10);
    const log = logs[key];
    if (!log) return null;
    const plan = DAILY_PLAN[log.mode];
    const required = (plan as unknown as { slot: string; items: { id: string; optional?: boolean }[] }[])
      .flatMap(s => s.items.filter(x => !x.optional).map(x => x.id));
    if (!required.length) return null;
    return log.taken.filter(id => required.includes(id)).length / required.length;
  }

  function getColor(pct: number | null): string {
    if (pct === null) return 'var(--bg-card-2)';
    if (pct >= 0.8) return '#34C759';
    if (pct >= 0.5) return '#FFCC00';
    return '#FF3B30';
  }

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[11px] text-label-secondary">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const pct = getPct(day);
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div
              key={day}
              title={pct !== null ? `${Math.round(pct * 100)}%` : undefined}
              className="aspect-square rounded-full flex items-center justify-center text-[11px] font-medium"
              style={{
                background: getColor(pct),
                color: pct !== null && pct >= 0.5 ? '#fff' : 'var(--label-secondary)',
                outline: isToday ? '2px solid var(--tint)' : 'none',
                outlineOffset: '1px',
              }}
            >
              {day}
            </div>
          );
        })}
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
  const data7 = getAdherence(logs, 7);
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

        {/* Calendar heatmap */}
        <div className="rounded-ios-xl bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="text-[17px] font-semibold text-label mb-3">
            {new Date().toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })}
          </h2>
          <CalendarHeatmap logs={logs} />
          <div className="flex gap-4 mt-3">
            {([['#34C759', '≥80%'], ['#FFCC00', '50–79%'], ['#FF3B30', '<50%']] as [string, string][]).map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5 text-[12px] text-label-secondary">
                <div className="h-3 w-3 rounded-full shrink-0" style={{ background: c }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart 7 days */}
        <div className="rounded-ios-xl bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="text-[17px] font-semibold text-label mb-4">Дотримання за 7 днів</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data7} barSize={28}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--label-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                formatter={(v: number) => [`${v}%`, 'Дотримання']}
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--separator)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: 'var(--label)',
                }}
                itemStyle={{ color: 'var(--label-secondary)' }}
                labelStyle={{ color: 'var(--label)' }}
              />
              <Bar dataKey="pct" fill="#34C759" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
