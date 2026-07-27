import React from "react";
import { WEEKDAYS, MONTH_NAMES } from "../utils/dateUtils.js";

export default function Header({ realToday, onExport, onShowHistory }) {
  const todayLabel =
    WEEKDAYS[realToday.getDay()] +
    ", " +
    MONTH_NAMES[realToday.getMonth()] +
    " " +
    realToday.getDate() +
    ", " +
    realToday.getFullYear();

  return (
    <header className="top">
      <div>
        <div className="brand-row">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21c0-6 4-9 8-10-1 6-4 10-8 10Zm0 0c0-7-4-11-8-12 0 7 3 12 8 12Z"
                stroke="#F3F1E6"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="brand">
            Growth <em>Log</em>
          </div>
        </div>
        <div className="tagline">
          A quiet place to grow twenty daily habits, one day at a time.
        </div>
      </div>
      <div className="top-actions">
        <button className="export-btn" onClick={onExport}>
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download my data
        <button className="history-btn" onClick={onShowHistory}>History</button>
        <div className="today-pill">{todayLabel}</div>
      </div>
    </header>
  );
}
