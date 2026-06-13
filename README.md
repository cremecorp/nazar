# Supplement Tracker

A personal PWA for tracking sports supplement intake. Designed in the style of **Apple Health** following Apple Human Interface Guidelines.

**🌐 [Open App](https://cremecorp.github.io/-nazar/)**

---

## Features

| Screen | What it does |
|---|---|
| **Today** | Choose day mode (Padel / Padel+F45 / Rest), supplement list with doses, progress ring, one-tap check-off |
| **Water** | Hydration tracker with +250/+500 ml buttons, progress ring, auto-reset at midnight |
| **History** | Streak counter, monthly calendar heatmap, 7-day adherence bar chart |
| **Library** | 9 reference sections: dosing by mode, intake conditions, course durations, CMT/knee notes, hydration, bloodwork, combinations to avoid, EFSA limits |
| **Profile** | Personal stats, Omega-3 & Collagen course progress bars, bloodwork checklist, theme switcher, JSON data export |

### Highlights
- Light & dark theme (`prefers-color-scheme` + manual override)
- All data stored in `localStorage` — no backend, fully offline
- PWA: installable on home screen, service worker, offline support
- Haptic feedback on check-off (Vibration API)
- Mobile-first layout, touch targets ≥ 44 pt (HIG)

---

## Stack

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** with iOS semantic color tokens (`--bg-grouped`, `--tint`, etc.)
- **lucide-react** — SF Symbols-style icons
- **recharts** — charts in the History tab
- **vite-plugin-pwa** — manifest + service worker

---

## Local Development

```bash
git clone https://github.com/cremecorp/-nazar.git
cd -- -nazar
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## Deploy to GitHub Pages

Deployment is **automatic** on every push to `main` via GitHub Actions.

To enable for the first time:
1. Go to **Settings → Pages → Source → GitHub Actions**
2. Push any commit to `main`

Live URL: `https://cremecorp.github.io/-nazar/`

---

## Project Structure

```
src/
├── data/
│   ├── supplements.ts   # 7 supplements with doses, benefits, cautions
│   ├── plan.ts          # DAILY_PLAN for 3 day modes
│   ├── modes.ts         # Mode definitions (padel / padelF45 / rest)
│   └── reference.ts     # Reference data (CONDITIONS, HYDRATION, BLOODWORK…)
├── components/
│   ├── ActivityRing.tsx  # Animated SVG progress ring (Apple Health style)
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
└── store.tsx             # React context + localStorage (key: suppl-tracker:v1)
```

---

> Protocol data verified against **EFSA (EU)** tolerable upper intake levels. This app is not medical advice.
