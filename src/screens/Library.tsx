import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { CONDITIONS, HYDRATION, DURATION, CMT_KNEES, BLOODWORK, DO_NOT_COMBINE, MINERAL_OVERLAP } from '../data/reference';
import { DAILY_PLAN } from '../data/plan';
import { MODES } from '../data/modes';
import { SUPPLEMENTS } from '../data/supplements';

type Section = 'modes' | 'schedule' | 'conditions' | 'duration' | 'cmt' | 'hydration' | 'bloodwork' | 'donotcombine' | 'mineraloverlap';

const SECTIONS: { id: Section; title: string; subtitle: string }[] = [
  { id: 'modes',          title: 'Режими та дози',             subtitle: 'Дози за кожним режимом дня' },
  { id: 'schedule',       title: 'Графік прийому',             subtitle: 'Тренувальний день і відпочинок' },
  { id: 'conditions',     title: 'Умови прийому',              subtitle: 'Натще або з їжею' },
  { id: 'duration',       title: 'Тривалість і перерви',       subtitle: 'Курси та рекомендації' },
  { id: 'cmt',            title: 'ШМТ + коліна',               subtitle: 'Персональні застереження' },
  { id: 'hydration',      title: 'Гідратація',                 subtitle: 'Вода та електроліти' },
  { id: 'bloodwork',      title: 'Аналізи та контроль',        subtitle: 'Що і коли здавати' },
  { id: 'donotcombine',   title: 'Що НЕ поєднувати',          subtitle: 'Несумісності та рекомендації' },
  { id: 'mineraloverlap', title: 'Чому Multi Mineral — 1 табл.', subtitle: 'Норми EFSA' },
];

type PlanItem = { id: string; optional?: boolean };
type PlanSlot = { slot: string; items: PlanItem[] };

function getSuppName(id: string) {
  return SUPPLEMENTS.find(s => s.id === id)?.name ?? id;
}

function card(children: React.ReactNode, key?: string) {
  return (
    <div key={key} className="rounded-ios-xl bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {children}
    </div>
  );
}

function ModesDetail() {
  return (
    <div className="space-y-4">
      {MODES.map(m => {
        const plan = DAILY_PLAN[m.id] as unknown as PlanSlot[];
        return card(
          <>
            <div className="px-4 py-3 border-b border-[var(--separator)]">
              <h3 className="text-[17px] font-semibold text-label">{m.label}</h3>
              <p className="text-[13px] text-label-secondary">Білок: {m.proteinTarget}</p>
            </div>
            {plan.map((slot, i) => (
              <div key={slot.slot} className={i > 0 ? 'border-t border-[var(--separator)]' : ''}>
                <p className="px-4 pt-2 text-[12px] uppercase tracking-wide font-medium text-label-secondary">{slot.slot}</p>
                {slot.items.map(item => (
                  <div key={item.id} className="flex justify-between px-4 py-2">
                    <span className="text-[15px] text-label">
                      {getSuppName(item.id)}
                      {item.optional && <span className="text-label-secondary"> (опційно)</span>}
                    </span>
                    <span className="text-[15px] font-medium tabular-nums text-label-secondary">
                      {SUPPLEMENTS.find(s => s.id === item.id)?.dose[m.id] ?? ''}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </>,
          m.id,
        );
      })}
    </div>
  );
}

function ScheduleDetail() {
  return (
    <div className="space-y-4">
      {MODES.map(m => {
        const plan = DAILY_PLAN[m.id] as unknown as PlanSlot[];
        return card(
          <>
            <div className="px-4 py-3 border-b border-[var(--separator)]">
              <h3 className="text-[17px] font-semibold text-label">{m.label}</h3>
            </div>
            {plan.map((slot, i) => (
              <div key={slot.slot} className={`px-4 py-3 ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}>
                <p className="text-[12px] uppercase tracking-wide text-label-secondary mb-1">{slot.slot}</p>
                <p className="text-[15px] text-label">
                  {slot.items.map(x => `${getSuppName(x.id)}${x.optional ? ' (опційно)' : ''}`).join(', ')}
                </p>
              </div>
            ))}
          </>,
          m.id,
        );
      })}
    </div>
  );
}

function ConditionsDetail() {
  return card(
    CONDITIONS.map((c, i) => (
      <div key={c.id} className={`px-4 py-3 ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[17px] font-semibold text-label">{getSuppName(c.id)}</span>
          <span className="rounded-full px-2 py-0.5 text-[12px] font-medium"
            style={{
              background: c.emptyStomachOk ? 'rgba(52,199,89,.15)' : 'rgba(120,120,128,.16)',
              color: c.emptyStomachOk ? '#1E8E3E' : 'var(--label-secondary)',
            }}>
            {c.emptyStomachOk ? 'натще ок' : 'з їжею'}
          </span>
        </div>
        <p className="text-[14px] text-label-secondary">{c.how}</p>
      </div>
    )),
  );
}

function DurationDetail() {
  return card(
    DURATION.map(([name, period, note], i) => (
      <div key={name} className={`px-4 py-3 ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}>
        <div className="flex justify-between">
          <span className="text-[17px] font-semibold text-label">{name}</span>
          <span className="text-[15px] text-label-secondary">{period}</span>
        </div>
        <p className="text-[13px] text-label-secondary mt-0.5">{note}</p>
      </div>
    )),
  );
}

function CmtDetail() {
  return (
    <div className="rounded-ios-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ background: 'rgba(255,149,0,.10)' }}>
      {CMT_KNEES.map((item, i) => (
        <div key={i} className={`px-4 py-3 ${i > 0 ? 'border-t border-[rgba(255,149,0,.2)]' : ''}`}>
          <p className="text-[15px] text-label">{item}</p>
        </div>
      ))}
    </div>
  );
}

function HydrationDetail() {
  return card(
    HYDRATION.map(([label, value], i) => (
      <div key={label} className={`px-4 py-3 ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}>
        <p className="text-[13px] text-label-secondary">{label}</p>
        <p className="text-[15px] font-medium text-label">{value}</p>
      </div>
    )),
  );
}

function BloodworkDetail() {
  return card(
    BLOODWORK.map(([name, note, when], i) => (
      <div key={name} className={`px-4 py-3 ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[17px] font-semibold text-label">{name}</span>
          <span className="text-[12px] text-tint shrink-0">{when}</span>
        </div>
        <p className="text-[13px] text-label-secondary mt-0.5">{note}</p>
      </div>
    )),
  );
}

function DoNotCombineDetail() {
  return card(
    DO_NOT_COMBINE.map(([combo, reason, tip], i) => (
      <div key={combo} className={`px-4 py-3 ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}>
        <p className="text-[15px] font-semibold text-label">{combo}</p>
        <p className="text-[13px] text-label-secondary mt-0.5">{reason}</p>
        <p className="text-[13px] text-tint mt-1">{tip}</p>
      </div>
    )),
  );
}

function MineralOverlapDetail() {
  const { header, rows, note } = MINERAL_OVERLAP;
  return (
    <div className="space-y-4">
      {card(
        <>
          <div className="px-3 py-3 bg-card-2 border-b border-[var(--separator)] grid grid-cols-5 gap-1">
            {header.map(h => (
              <span key={h} className="text-[10px] font-semibold text-label-secondary text-center">{h}</span>
            ))}
          </div>
          {rows.map((row, i) => (
            <div
              key={row[0]}
              className={`px-3 py-3 grid grid-cols-5 gap-1 ${i > 0 ? 'border-t border-[var(--separator)]' : ''} ${i === 0 || i === 1 ? 'bg-[rgba(255,59,48,.06)]' : ''}`}
            >
              {row.map((cell, j) => (
                <span key={j} className="text-[11px] text-center text-label">{cell}</span>
              ))}
            </div>
          ))}
        </>,
      )}
      <div className="rounded-ios-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ background: 'rgba(255,204,0,.12)' }}>
        <p className="text-[14px] text-label">{note}</p>
      </div>
    </div>
  );
}

const DETAIL_COMPONENTS: Record<Section, React.FC> = {
  modes: ModesDetail,
  schedule: ScheduleDetail,
  conditions: ConditionsDetail,
  duration: DurationDetail,
  cmt: CmtDetail,
  hydration: HydrationDetail,
  bloodwork: BloodworkDetail,
  donotcombine: DoNotCombineDetail,
  mineraloverlap: MineralOverlapDetail,
};

export function Library() {
  const [active, setActive] = useState<Section | null>(null);

  if (active) {
    const Detail = DETAIL_COMPONENTS[active];
    const sec = SECTIONS.find(s => s.id === active)!;
    return (
      <div className="min-h-screen bg-grouped pb-32">
        <header className="sticky top-0 z-10 flex items-center px-4 pt-12 pb-3" style={{ background: 'var(--bg-grouped)' }}>
          <button
            onClick={() => setActive(null)}
            className="flex items-center gap-1 text-tint active:opacity-60 transition-opacity"
            style={{ minHeight: 44 }}
            aria-label="Назад"
          >
            <ChevronLeft size={20} />
            <span className="text-[17px]">Довідник</span>
          </button>
        </header>
        <div className="px-4">
          <h1 className="text-[28px] font-bold text-label mb-4">{sec.title}</h1>
          <Detail />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grouped pb-32">
      <header className="sticky top-0 z-10 px-4 pt-12 pb-3" style={{ background: 'var(--bg-grouped)' }}>
        <h1 className="text-[34px] font-bold text-label">Довідник</h1>
      </header>
      <div className="px-4">
        <div className="rounded-ios-xl bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left active:bg-card-2 transition-colors ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}
            >
              <div>
                <p className="text-[17px] font-medium text-label">{s.title}</p>
                <p className="text-[13px] text-label-secondary">{s.subtitle}</p>
              </div>
              <ChevronRight size={18} className="text-label-tertiary shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

