type Evidence = 'strong' | 'moderate' | 'low' | 'optional';

const CONFIG: Record<Evidence, { label: string; bg: string; color: string }> = {
  strong:   { label: 'Сильний',  bg: 'rgba(52,199,89,.15)',   color: '#1E8E3E' },
  moderate: { label: 'Помірний', bg: 'rgba(255,204,0,.18)',   color: '#B07D00' },
  low:      { label: 'Слабкий',  bg: 'rgba(120,120,128,.16)', color: 'var(--label-secondary)' },
  optional: { label: 'Опційний', bg: 'rgba(120,120,128,.16)', color: 'var(--label-secondary)' },
};

export function EvidencePill({ evidence }: { evidence: Evidence }) {
  const c = CONFIG[evidence] ?? CONFIG.optional;
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-[13px] font-semibold"
      style={{ background: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}
