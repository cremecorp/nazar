import { useState } from 'react';
import { useStore } from '../store';
import { BLOODWORK } from '../data/reference';
import { Download, RotateCcw, Moon, Sun, Monitor } from 'lucide-react';

function differenceInDays(start: string): number {
  const s = new Date(start);
  const now = new Date();
  return Math.floor((now.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

function CourseBar({ days, max, color }: { days: number; max: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-card-2 overflow-hidden mt-2 mb-1">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, (days / max) * 100)}%`, background: color }}
      />
    </div>
  );
}

export function Profile() {
  const { state, setState } = useStore();
  const { profile, courses, nextReviewDate, theme } = state;
  const [weightInput, setWeightInput] = useState(String(profile.weightKg));

  const setTheme = (t: 'system' | 'light' | 'dark') =>
    setState(s => ({ ...s, theme: t }));

  const handleReset = () => {
    if (window.confirm('Скинути всі дані? Це видалить всю історію.')) {
      localStorage.removeItem('suppl-tracker:v1');
      window.location.reload();
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supplement-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const omega3Days = courses.omega3 ? differenceInDays(courses.omega3.startDate) : null;
  const collagenDays = courses.collagen ? differenceInDays(courses.collagen.startDate) : null;

  const today = new Date().toISOString().slice(0, 10);
  const reviewOverdue = nextReviewDate && today >= nextReviewDate;

  return (
    <div className="min-h-screen bg-grouped pb-32">
      <header className="sticky top-0 z-10 px-4 pt-12 pb-3" style={{ background: 'var(--bg-grouped)' }}>
        <h1 className="text-[34px] font-bold text-label">Профіль</h1>
      </header>

      <div className="px-4 space-y-5">
        {/* Review banner */}
        {reviewOverdue && (
          <div className="rounded-ios-xl p-4" style={{ background: 'rgba(255,149,0,.12)' }}>
            <p className="text-[15px] font-semibold text-label">Час переглянути план</p>
            <p className="text-[13px] text-label-secondary mt-1">
              Настала дата перегляду — оновіть аналізи та скоригуйте протокол.
            </p>
          </div>
        )}

        {/* Profile params */}
        <div>
          <h2 className="text-[13px] uppercase tracking-wide text-label-secondary mb-2 px-1">Параметри</h2>
          <div className="rounded-ios-xl bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {[
              ['Стать', 'Чоловічий'],
              ['Вік', `${profile.age} р.`],
              ['Зріст', `${profile.heightCm} см`],
              ['Ціль', 'Здоров\'я і форма'],
            ].map(([label, value], i) => (
              <div key={label} className={`flex justify-between px-4 py-3 ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}>
                <span className="text-[17px] text-label">{label}</span>
                <span className="text-[17px] text-label-secondary">{value}</span>
              </div>
            ))}
            <div className="flex items-center px-4 py-3 border-t border-[var(--separator)] gap-2">
              <span className="flex-1 text-[17px] text-label">Вага</span>
              <input
                type="number"
                value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                onBlur={() => {
                  const v = parseFloat(weightInput);
                  if (v > 30 && v < 300) setState(s => ({ ...s, profile: { ...s.profile, weightKg: v } }));
                }}
                className="w-16 text-right text-[17px] text-label-secondary bg-transparent outline-none"
                aria-label="Вага в кг"
              />
              <span className="text-[17px] text-label-secondary">кг</span>
            </div>
            <div className="flex justify-between px-4 py-3 border-t border-[var(--separator)]">
              <span className="text-[17px] text-label">Ціль води</span>
              <span className="text-[17px] text-label-secondary">{(profile.waterGoalMl / 1000).toFixed(1)} л</span>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-[13px] uppercase tracking-wide text-label-secondary mb-2 px-1">Курси</h2>
          <div className="rounded-ios-xl bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {/* Omega-3 */}
            <div className="px-4 py-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[17px] font-semibold text-label">Омега-3</span>
                {omega3Days !== null && (
                  <span className="text-[14px] text-label-secondary">{omega3Days} дн.</span>
                )}
              </div>
              {omega3Days !== null && (
                <>
                  <CourseBar days={omega3Days} max={90} color={omega3Days >= 90 ? '#FF9500' : '#30B0C7'} />
                  <p className="text-[12px] text-label-secondary">
                    {omega3Days >= 90 ? 'Рекомендується зробити перерву ~1 міс' : `До рекомендованої паузи: ${90 - omega3Days} дн.`}
                  </p>
                </>
              )}
              <button
                onClick={() => setState(s => ({ ...s, courses: { ...s.courses, omega3: { startDate: new Date().toISOString().slice(0, 10) } } }))}
                className="mt-2 text-[14px] text-tint"
              >
                {omega3Days !== null ? 'Перезапустити курс' : 'Почати курс'}
              </button>
            </div>
            {/* Collagen */}
            <div className="px-4 py-3 border-t border-[var(--separator)]">
              <div className="flex justify-between items-baseline">
                <span className="text-[17px] font-semibold text-label">Колаген</span>
                {collagenDays !== null && (
                  <span className="text-[14px] text-label-secondary">{collagenDays} дн.</span>
                )}
              </div>
              {collagenDays !== null && (
                <>
                  <CourseBar days={collagenDays} max={84} color="#AF52DE" />
                  <p className="text-[12px] text-label-secondary">
                    {collagenDays >= 56 ? 'Ефект накопичується — продовжуй' : `До мінімуму (8 тижнів): ${56 - collagenDays} дн.`}
                  </p>
                </>
              )}
              <button
                onClick={() => setState(s => ({ ...s, courses: { ...s.courses, collagen: { startDate: new Date().toISOString().slice(0, 10) } } }))}
                className="mt-2 text-[14px] text-tint"
              >
                {collagenDays !== null ? 'Перезапустити курс' : 'Почати курс'}
              </button>
            </div>
          </div>
        </div>

        {/* Bloodwork */}
        <div>
          <h2 className="text-[13px] uppercase tracking-wide text-label-secondary mb-2 px-1">Аналізи</h2>
          <div className="rounded-ios-xl bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {BLOODWORK.map(([name, , when], i) => (
              <div key={name} className={`flex justify-between items-center px-4 py-3 ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}>
                <span className="text-[17px] text-label">{name}</span>
                <span className="text-[13px] text-tint">{when}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--separator)]">
              <span className="text-[17px] text-label">Дата перегляду</span>
              <input
                type="date"
                value={nextReviewDate ?? ''}
                onChange={e => setState(s => ({ ...s, nextReviewDate: e.target.value }))}
                className="text-[14px] text-tint bg-transparent outline-none"
                aria-label="Дата наступного перегляду"
              />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div>
          <h2 className="text-[13px] uppercase tracking-wide text-label-secondary mb-2 px-1">Зовнішній вигляд</h2>
          <div className="rounded-ios-xl bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {[
              { id: 'system' as const, label: 'Системна', Icon: Monitor },
              { id: 'light'  as const, label: 'Світла',   Icon: Sun },
              { id: 'dark'   as const, label: 'Темна',    Icon: Moon },
            ].map(({ id, label, Icon }, i) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`w-full flex items-center justify-between px-4 py-3 active:bg-card-2 ${i > 0 ? 'border-t border-[var(--separator)]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} style={{ color: 'var(--label-secondary)' }} />
                  <span className="text-[17px] text-label">{label}</span>
                </div>
                {theme === id && (
                  <div className="h-5 w-5 rounded-full flex items-center justify-center" style={{ background: 'var(--tint)' }}>
                    <span className="text-white text-[12px] font-bold">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Data actions */}
        <div>
          <h2 className="text-[13px] uppercase tracking-wide text-label-secondary mb-2 px-1">Дані</h2>
          <div className="rounded-ios-xl bg-card overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-card-2"
            >
              <Download size={18} style={{ color: 'var(--tint)' }} />
              <span className="text-[17px] text-tint">Експортувати дані (JSON)</span>
            </button>
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-3 px-4 py-3 text-left border-t border-[var(--separator)] active:bg-card-2"
            >
              <RotateCcw size={18} color="#FF3B30" />
              <span className="text-[17px]" style={{ color: '#FF3B30' }}>Скинути всі дані</span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-ios-xl bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-[13px] text-label-secondary leading-relaxed">
            Це загальні рекомендації для здорової людини, не медична консультація. Норми наведено за EFSA (ЄС).
            При ліках, проблемах із нирками/тиском або тривалому прийомі заліза — звернутися до лікаря;
            врахувати ШМТ і нестабільність коліна з неврологом і фізіотерапевтом.
          </p>
        </div>
      </div>
    </div>
  );
}
