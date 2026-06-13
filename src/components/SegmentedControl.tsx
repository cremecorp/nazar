type Opt<T extends string> = { id: T; label: string };

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Opt<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  const idx = options.findIndex(o => o.id === value);
  const w = `calc((100% - 0.5rem) / ${options.length})`;
  return (
    <div className="relative flex p-1 rounded-ios bg-[rgba(120,120,128,0.12)]" role="group">
      <div
        className="absolute top-1 bottom-1 rounded-[8px] bg-card shadow-sm"
        style={{
          width: w,
          left: `calc(${idx} * ${w} + 0.25rem)`,
          transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      {options.map(o => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`relative z-10 flex-1 py-1.5 text-[13px] font-medium transition-colors ${
            value === o.id ? 'text-label' : 'text-label-secondary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
