import React from "react";
import { WEEKDAYS, MONTH_NAMES, parseKey } from "../utils/dateUtils.js";

export default function DayModal({
  dayKey,
  isOpen,
  tasks,
  taskStates,
  pct,
  isComplete,
  isStartDay,
  onToggle,
  onClose,
}) {
  const d = dayKey ? parseKey(dayKey) : null;

  return (
    <div className={"overlay" + (isOpen ? " open" : "")} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal">
        {d && (
          <>
            <div className="modal-head">
              <div>
                <div className="modal-date">
                  {MONTH_NAMES[d.getMonth()]} {d.getDate()}, {d.getFullYear()}
                </div>
                <div className="modal-weekday">
                  {WEEKDAYS[d.getDay()]}
                  {isStartDay ? " · Start day" : ""}
                </div>
              </div>
              <button className="close-btn" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>

            <div className={"modal-status" + (isComplete ? " done" : "")}>
              <span className="modal-status-text">
                {isComplete
                  ? "Day Completed"
                  : pct === 0
                  ? "No tasks completed yet"
                  : pct + "% underway"}
              </span>
              <span className="modal-status-pct">{pct}%</span>
            </div>

            <ul className="task-list">
              {tasks.map((name, idx) => (
                <li
                  key={idx}
                  className={"task-row" + (taskStates[idx] ? " checked" : "")}
                  onClick={() => onToggle(idx)}
                >
                  <span className="task-check">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="task-name">{name}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
