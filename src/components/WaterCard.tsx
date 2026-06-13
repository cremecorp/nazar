import { Droplets, Plus, Minus } from 'lucide-react';
import { useStore } from '../store';
import { ActivityRing } from './ActivityRing';

export function WaterCard() {
  const { day, addWater, state, waterProgress } = useStore();
  const goal = state.profile.waterGoalMl;
  const current = day.waterMl;

  const fmt = (ml: number) => ml >= 1000 ? `${(ml / 1000).toFixed(1)} л` : `${ml} мл`;

  return (
    <div className="mx-4 mt-4 rounded-ios-xl bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets size={20} color="#0A84FF" />
          <span className="text-[17px] font-semibold text-label">Вода</span>
        </div>
        <span className="text-[15px] tabular-nums text-label-secondary">{fmt(current)} / {fmt(goal)}</span>
      </div>
      <div className="flex items-center gap-4">
        <ActivityRing
          progress={waterProgress}
          size={80}
          stroke={10}
          color="#0A84FF"
          track="rgba(10,132,255,.16)"
        >
          <span className="text-[13px] font-bold tabular-nums text-label">
            {Math.round(waterProgress * 100)}%
          </span>
        </ActivityRing>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => addWater(250)}
              aria-label="Додати 250 мл"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-ios py-2.5 text-[15px] font-semibold text-white active:scale-[0.97] transition-transform"
              style={{ background: '#0A84FF' }}
            >
              <Plus size={16} /> 250 мл
            </button>
            <button
              onClick={() => addWater(500)}
              aria-label="Додати 500 мл"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-ios py-2.5 text-[15px] font-semibold text-white active:scale-[0.97] transition-transform"
              style={{ background: '#0A84FF' }}
            >
              <Plus size={16} /> 500 мл
            </button>
          </div>
          <button
            onClick={() => addWater(-250)}
            aria-label="Зменшити на 250 мл"
            className="flex items-center justify-center gap-1.5 rounded-ios py-2 text-[14px] font-medium text-label-secondary bg-card-2 active:scale-[0.97] transition-transform"
          >
            <Minus size={14} /> 250 мл
          </button>
        </div>
      </div>
    </div>
  );
}
