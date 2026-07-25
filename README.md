# Growth Log — React Habit Tracker

A calendar-style habit tracker (GitHub-contributions / Notion-style) for 20 daily
habits, built with React + Vite.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build a static production bundle:

```bash
npm run build
npm run preview
```

## What it does

- Calendar covering **tomorrow through December 31**, with month tabs.
- Click any date to open its checklist of 20 habits.
- Checking/unchecking a task saves instantly to the browser's `localStorage`
  — fully offline, no backend required.
- A date turns **green with a ✓** the moment all 20 tasks are checked; any
  single uncheck reverts it immediately.
- Auto-calculated: daily/weekly/monthly/overall progress, current streak,
  longest streak, and total perfect days.
- Confetti celebration the moment a day first becomes complete.
- "Download my data" exports a JSON backup of everything you've logged.

## Project structure

```
src/
  data/tasks.js          the 20 habit definitions
  utils/dateUtils.js      date/range/key helpers
  utils/storage.js        localStorage load/save + JSON export
  hooks/useHabitData.js   state + derived stats/streaks
  components/
    Header.jsx
    RangeBanner.jsx
    StatsBar.jsx
    Legend.jsx
    MonthTabs.jsx
    Calendar.jsx
    DayModal.jsx
    Confetti.jsx
    Toast.jsx
  App.jsx
  index.css
```

## Notes

- Each date's data is stored independently, keyed by `YYYY-MM-DD` — completing
  one day never affects another.
- The tracked window is computed as "tomorrow" relative to whenever the app is
  opened, so it will shift forward by a day each time you return after a gap.
  If you'd rather it lock in permanently on first run, that's a small change
  to `src/utils/dateUtils.js` (persist the anchor date in storage instead of
  recomputing it every load).
# Tracker
