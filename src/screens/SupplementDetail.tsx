import { ChevronLeft, Check, AlertTriangle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { EvidencePill } from '../components/EvidencePill';
import type { Mode } from '../data/plan';
import { MODES } from '../data/modes';

type Supplement = {
  id: string;
  name: string;
  fullName: string;
  brand: string;
  color: string;
  icon: string;
  evidence: string;
  emptyStomachOk: boolean;
  dose: Record<string, string>;
  benefit: string;
  duration: string;
  notes: string;
  cautions: readonly string[];
};

type Props = {
  supplement: Supplement;
  mode: Mode;
  taken: boolean;
  onToggle: () => void;
  onBack: () => void;
};

export function SupplementDetail({ supplement: s, mode, taken, onToggle, onBack }: Props) {
  const Icon = ((Icons as Record<string, unknown>)[s.icon] ?? Icons.Pill) as typeof Icons.Pill;
  return (
    <div className="min-h-screen bg-grouped pb-32">
      <div className="sticky top-0 z-10 flex items-center px-4 pt-12 pb-3" style={{ background: 'var(--bg-grouped)' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-tint active:opacity-60 transition-opacity"
          style={{ minHeight: 44, minWidth: 44 }}
          aria-label="Назад"
        >
          <ChevronLeft size={20} />
          <span className="text-[17px]">Назад</span>
        </button>
      </div>

      {/* Hero */}
      <div className="mx-4 rounded-ios-xl p-6 flex items-center gap-4" style={{ background: s.color }}>
        <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-white/20 shrink-0">
          <Icon size={36} color="#fff" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold text-white leading-tight">{s.name}</h1>
          <p className="text-[13px] text-white/80">{s.fullName}</p>
          <p className="text-[13px] text-white/70">{s.brand}</p>
        </div>
      </div>

      <div className="mx-4 mt-4 space-y-3">
        {/* Evidence */}
        <div className="rounded-ios-xl bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-[12px] uppercase tracking-wide text-label-secondary mb-2">Рівень доказовості</p>
          <EvidencePill evidence={s.evidence as 'strong' | 'moderate' | 'low' | 'optional'} />
        </div>

        {/* Benefit */}
        <div className="rounded-ios-xl bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-[12px] uppercase tracking-wide text-label-secondary mb-1">Що дає</p>
          <p className="text-[17px] text-label leading-snug">{s.benefit}</p>
        </div>

        {/* Doses per mode */}
        <div className="rounded-ios-xl bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="px-4 pt-4 pb-2 text-[12px] uppercase tracking-wide text-label-secondary">Доза за режимом</p>
          {MODES.map((m, i) => (
            <div
              key={m.id}
              className={`flex justify-between px-4 py-3 ${i > 0 ? 'border-t border-[var(--separator)]' : ''} ${m.id === mode ? 'bg-[rgba(0,122,255,.06)]' : ''}`}
            >
              <span className="text-[15px] text-label-secondary">{m.label}</span>
              <span className="text-[15px] font-semibold tabular-nums text-label">{s.dose[m.id]}</span>
            </div>
          ))}
        </div>

        {/* Notes & duration */}
        <div className="rounded-ios-xl bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-[12px] uppercase tracking-wide text-label-secondary mb-1">Прийом</p>
          <p className="text-[15px] text-label">{s.notes}</p>
          <p className="mt-2 text-[13px] text-label-secondary">Тривалість: {s.duration}</p>
          <p className="mt-1 text-[13px] text-label-secondary">
            Умова:{' '}
            <span className="font-medium" style={{ color: s.emptyStomachOk ? '#1E8E3E' : 'var(--label-secondary)' }}>
              {s.emptyStomachOk ? 'натще ок' : 'тільки з їжею'}
            </span>
          </p>
        </div>

        {/* Cautions */}
        {(s.cautions as string[]).length > 0 && (
          <div className="rounded-ios-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ background: 'rgba(255,204,0,.12)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} color="#B07D00" />
              <p className="text-[12px] uppercase tracking-wide font-semibold" style={{ color: '#B07D00' }}>Застереження</p>
            </div>
            {(s.cautions as string[]).map((c, i) => (
              <p key={i} className={`text-[15px] text-label ${i > 0 ? 'mt-2' : ''}`}>{c}</p>
            ))}
          </div>
        )}

        {/* Mark taken */}
        <button
          onClick={() => { onToggle(); (navigator as { vibrate?: (ms: number) => void }).vibrate?.(10); }}
          className="w-full flex items-center justify-center gap-2 rounded-ios-xl py-4 text-[17px] font-semibold transition-all active:scale-[0.97]"
          style={{
            background: taken ? 'rgba(52,199,89,.15)' : 'var(--tint)',
            color: taken ? '#1E8E3E' : '#fff',
          }}
        >
          {taken ? (
            <><Check size={20} /> Прийнято сьогодні</>
          ) : (
            'Відмітити прийнятим сьогодні'
          )}
        </button>
      </div>
    </div>
  );
}
