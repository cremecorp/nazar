export const DAILY_PLAN = {
  padel: [
    { slot: 'Зранку', items: [{ id: 'multivitamin' }, { id: 'omega3' }] },
    { slot: 'За ~45 хв до гри', items: [{ id: 'collagen' }] },
    { slot: 'Після гри', items: [{ id: 'creatine' }, { id: 'whey', optional: true }] },
    { slot: 'Увечері', items: [{ id: 'mineral' }] },
  ],
  padelF45: [
    { slot: 'Зранку', items: [{ id: 'multivitamin' }, { id: 'omega3' }] },
    { slot: 'За ~45 хв до трен.', items: [{ id: 'collagen' }] },
    { slot: 'Після тренування', items: [{ id: 'creatine' }, { id: 'whey' }, { id: 'glutamine', optional: true }] },
    { slot: 'Увечері', items: [{ id: 'mineral' }] },
  ],
  rest: [
    { slot: 'Зранку', items: [{ id: 'multivitamin' }, { id: 'omega3' }, { id: 'creatine' }, { id: 'collagen' }] },
    { slot: 'Увечері', items: [{ id: 'mineral', optional: true }] },
  ],
} as const;

export type Mode = keyof typeof DAILY_PLAN;
