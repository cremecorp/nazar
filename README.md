# Добавки — Supplement Tracker

Персональний PWA-застосунок для відстеження прийому спортивних добавок. Дизайн у стилі **Apple Health**, мова інтерфейсу — **українська**.

**🌐 [Відкрити застосунок](https://cremecorp.github.io/-nazar/)**

---

## Можливості

| Екран | Функціонал |
|---|---|
| **Сьогодні** | Вибір режиму дня (Падел / Падел+F45 / Відпочинок), список добавок із дозами, кільце прогресу, відмітка одним тапом |
| **Вода** | Трекер гідратації з кнопками +250/+500 мл, власне кільце прогресу, скидання опівночі |
| **Історія** | Серія (streak), місячний calendar heatmap, стовпчастий графік дотримання за 7 днів |
| **Довідник** | 9 розділів: режими та дози, умови прийому, тривалість курсів, ШМТ+коліна, гідратація, аналізи, що не поєднувати, норми EFSA |
| **Профіль** | Параметри, прогрес курсів Омега-3 і Колагену, чекліст аналізів, перемикач теми, експорт JSON |

### Ключові деталі
- Темна та світла теми (`prefers-color-scheme` + ручне перемикання)
- Збереження даних у `localStorage` — без бекенду, повністю офлайн
- PWA: installable, service worker, офлайн-режим
- Тактильний відгук при відмітці (Vibration API)
- Адаптивний під мобільний, цілі ≥ 44 pt (HIG)

---

## Стек

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** з iOS-токенами (semantic colors, `--bg-grouped`, `--tint` тощо)
- **lucide-react** — іконки у стилі SF Symbols
- **recharts** — графіки в Історії
- **vite-plugin-pwa** — manifest + service worker

---

## Запуск локально

```bash
git clone https://github.com/cremecorp/-nazar.git
cd -- -nazar
npm install
npm run dev
```

Відкрити: `http://localhost:5173`

---

## Деплой на GitHub Pages

Деплой відбувається **автоматично** при пуші в `main` через GitHub Actions.

Щоб увімкнути вперше:
1. `Settings → Pages → Source → GitHub Actions`
2. Запушити будь-який коміт у `main`

Сайт: `https://cremecorp.github.io/-nazar/`

---

## Структура проєкту

```
src/
├── data/
│   ├── supplements.ts   # 7 добавок з дозами, описами, застереженнями
│   ├── plan.ts          # DAILY_PLAN для 3 режимів
│   ├── modes.ts         # MODES (padel / padelF45 / rest)
│   └── reference.ts     # Довідникові дані (CONDITIONS, HYDRATION, BLOODWORK…)
├── components/
│   ├── ActivityRing.tsx  # SVG-кільце прогресу (як Apple Health)
│   ├── SegmentedControl.tsx
│   ├── SupplementRow.tsx
│   ├── WaterCard.tsx
│   ├── EvidencePill.tsx
│   └── TabBar.tsx
├── screens/
│   ├── Today.tsx
│   ├── History.tsx
│   ├── Library.tsx
│   ├── Profile.tsx
│   └── SupplementDetail.tsx
└── store.tsx             # Контекст + localStorage (suppl-tracker:v1)
```

---

> Дані протоколу звірені з нормами **EFSA (ЄС)**. Застосунок не є медичною консультацією.
