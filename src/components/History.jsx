import React from "react";

export default function History({ trackedKeys, dayPct, onDayClick, onBack }) {
  // Convert key strings to Date objects for display
  const dates = trackedKeys.map((key) => {
    const d = new Date(key);
    return {
      key,
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      pct: dayPct(key)
    };
  });

  return (
    <div className="history-wrapper">
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>History</h2>
      </div>
      <div className="history-list">
        {dates.map(({ key, label, pct }) => (
          <div key={key} className="history-item" onClick={() => onDayClick(key)}>
            <span className="history-date">{label}</span>
            <span className="history-pct">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
