import { Home, CalendarDays, BookOpen, User, type LucideIcon } from 'lucide-react';

export type Tab = 'today' | 'history' | 'library' | 'profile';

const TABS: { id: Tab; label: string; Icon: LucideIcon }[] = [
  { id: 'today',   label: 'Сьогодні', Icon: Home },
  { id: 'history', label: 'Історія',  Icon: CalendarDays },
  { id: 'library', label: 'Довідник', Icon: BookOpen },
  { id: 'profile', label: 'Профіль',  Icon: User },
];

export function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      className="tab-bar-bg fixed bottom-0 inset-x-0 flex border-t"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--separator)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 50,
      }}
      aria-label="Навігація"
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-[49px] active:scale-[0.92] transition-transform duration-[120ms]"
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={{ color: isActive ? 'var(--tint)' : 'var(--label-secondary)' }}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: isActive ? 'var(--tint)' : 'var(--label-secondary)' }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
