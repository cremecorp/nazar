import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DAILY_PLAN, type Mode } from './data/plan';

const KEY = 'suppl-tracker:v1';
const todayStr = () => new Date().toISOString().slice(0, 10);

export type { Mode };

export type DayLog = {
  date: string;
  mode: Mode;
  taken: string[];
  waterMl: number;
};

export type Profile = {
  sex: 'm';
  age: number;
  weightKg: number;
  heightCm: number;
  goal: 'health';
  waterGoalMl: number;
};

export type AppState = {
  profile: Profile;
  courses: {
    omega3?: { startDate: string };
    collagen?: { startDate: string };
  };
  nextReviewDate?: string;
  reminders: Record<string, boolean>;
  theme: 'system' | 'light' | 'dark';
  logs: Record<string, DayLog>;
};

const initial: AppState = {
  profile: { sex: 'm', age: 28, weightKg: 74, heightCm: 175, goal: 'health', waterGoalMl: 2400 },
  courses: {},
  reminders: {},
  theme: 'system',
  logs: {},
};

function addMonths(date: Date, n: number): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d.toISOString().slice(0, 10);
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return {
        ...initial,
        ...parsed,
        profile: { ...initial.profile, ...(parsed.profile ?? {}) },
        courses: { ...initial.courses, ...(parsed.courses ?? {}) },
      };
    }
  } catch {
    // fall through to defaults
  }
  return {
    ...initial,
    nextReviewDate: addMonths(new Date(), 3),
  };
}

type StoreValue = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  day: DayLog;
  setMode: (mode: Mode) => void;
  toggle: (id: string) => void;
  addWater: (ml: number) => void;
  plan: { slot: string; items: { id: string; optional?: boolean }[] }[];
  required: string[];
  progress: number;
  waterProgress: number;
};

const Ctx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const date = todayStr();
  const day: DayLog = state.logs[date] ?? { date, mode: 'rest', taken: [], waterMl: 0 };

  const patch = useCallback((d: Partial<DayLog>) => {
    setState(s => {
      const current = s.logs[date] ?? { date, mode: 'rest', taken: [], waterMl: 0 };
      return { ...s, logs: { ...s.logs, [date]: { ...current, ...d } } };
    });
  }, [date]);

  const setMode = useCallback((mode: Mode) => patch({ mode }), [patch]);

  const toggle = useCallback((id: string) => {
    setState(s => {
      const current = s.logs[date] ?? { date, mode: 'rest', taken: [], waterMl: 0 };
      const taken = current.taken.includes(id)
        ? current.taken.filter(x => x !== id)
        : [...current.taken, id];
      return { ...s, logs: { ...s.logs, [date]: { ...current, taken } } };
    });
  }, [date]);

  const addWater = useCallback((ml: number) => {
    setState(s => {
      const current = s.logs[date] ?? { date, mode: 'rest', taken: [], waterMl: 0 };
      return { ...s, logs: { ...s.logs, [date]: { ...current, waterMl: Math.max(0, current.waterMl + ml) } } };
    });
  }, [date]);

  const rawPlan = DAILY_PLAN[day.mode];
  const plan = (rawPlan as unknown as { slot: string; items: { id: string; optional?: boolean }[] }[]);
  const required: string[] = plan.flatMap(s => s.items.filter(i => !i.optional).map(i => i.id));
  const takenReq = required.filter(id => day.taken.includes(id));
  const progress = required.length ? takenReq.length / required.length : 0;
  const waterProgress = day.waterMl / state.profile.waterGoalMl;

  return (
    <Ctx.Provider value={{ state, setState, day, setMode, toggle, addWater, plan, required, progress, waterProgress }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
