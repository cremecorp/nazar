import * as Icons from 'lucide-react';
import { Check } from 'lucide-react';

type Props = {
  name: string;
  dose: string;
  color: string;
  iconName: string;
  emptyStomachOk: boolean;
  taken: boolean;
  optional?: boolean;
  onToggle: () => void;
  onOpen?: () => void;
};

export function SupplementRow(p: Props) {
  const Icon = ((Icons as Record<string, unknown>)[p.iconName] ?? Icons.Pill) as typeof Icons.Pill;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <button
        onClick={p.onOpen}
        className="flex flex-1 items-center gap-3 text-left active:scale-[0.97] transition-transform duration-[120ms]"
        aria-label={`Деталі ${p.name}`}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px]"
          style={{ backgroundColor: p.color }}
          aria-hidden="true"
        >
          <Icon size={18} color="#fff" strokeWidth={2.2} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[17px] font-semibold leading-tight text-label">
            {p.name}
            {p.optional && <span className="font-normal text-label-secondary"> · за потреби</span>}
          </span>
          <span className="block text-[15px] tabular-nums text-label-secondary">{p.dose}</span>
        </span>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[12px] font-medium"
          style={{
            background: p.emptyStomachOk ? 'rgba(52,199,89,.15)' : 'rgba(120,120,128,.16)',
            color: p.emptyStomachOk ? '#1E8E3E' : 'var(--label-secondary)',
          }}
        >
          {p.emptyStomachOk ? 'натще ок' : 'з їжею'}
        </span>
      </button>
      <button
        aria-label={p.taken ? 'Прийнято' : 'Відмітити'}
        onClick={() => { p.onToggle(); (navigator as { vibrate?: (ms: number) => void }).vibrate?.(10); }}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all duration-300"
        style={{
          borderColor: p.taken ? '#34C759' : 'rgba(120,120,128,.4)',
          background: p.taken ? '#34C759' : 'transparent',
        }}
      >
        {p.taken && <Check size={16} color="#fff" strokeWidth={3} />}
      </button>
    </div>
  );
}
