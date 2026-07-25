import React from "react";
import { WEEKDAYS, MONTH_NAMES, keyOf } from "../utils/dateUtils.js";

function pctClass(pct) {
  if (pct === 100) return "pct-green";
  if (pct > 50) return "pct-yellow";
  return "pct-gray";
}

export default function Calendar({
  year,
  month,
  trackStart,
  rangeEnd,
  realToday,
  dayPct,
  monthPct,
  onDayClick,
  celebratingKey,
}) {
  const inRange = (d) => d.getTime() >= trackStart.getTime() && d.getTime() <= rangeEnd.getTime();

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div className="day-cell empty-slot" key={"blank-" + i} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = keyOf(d);

    if (!inRange(d)) {
      const isRealToday = d.getTime() === realToday.getTime();
      cells.push(
        <div className="day-cell out-of-range" key={key}>
          <span className="day-num">{day}</span>
          {isRealToday && <span className="today-flag">Today</span>}
        </div>
      );
      continue;
    }

    const pct = dayPct(key);
    const isStart = d.getTime() === trackStart.getTime();
    const cls =
      "day-cell " +
      pctClass(pct) +
      (isStart ? " start-day" : "") +
      (celebratingKey === key ? " celebrate" : "");

    cells.push(
      <div
        className={cls}
        key={key}
        title={MONTH_NAMES[month] + " " + day + " — " + pct + "% complete"}
        onClick={() => onDayClick(key)}
      >
        <span className="day-num">{day}</span>
        <span className="check-badge">✓</span>
        {isStart && <span className="start-badge">Start</span>}
      </div>
    );
  }

  return (
    <div className="month-block">
      <h2>
        {MONTH_NAMES[month]} {year}{" "}
        <span className="month-pct">{monthPct}% so far</span>
      </h2>
      <div className="grid">
        {WEEKDAYS.map((w) => (
          <div className="wk-label" key={w}>
            {w}
          </div>
        ))}
        {cells}
      </div>
    </div>
  );
}
