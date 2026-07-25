import React from "react";

function ProgressCard({ label, pct }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{pct}%</div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

function StreakCard({ label, value, unit, flame }) {
  return (
    <div className="stat-card streak">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {flame && <span className="flame">🔥</span>}
        {value}
        <span className="unit"> {unit}</span>
      </div>
    </div>
  );
}

export default function StatsBar({
  firstDayLabel,
  firstDayPct,
  weeklyPct,
  monthlyPct,
  overallPct,
  streaks,
  perfectDaysCount,
}) {
  return (
    <div className="stats">
      <ProgressCard label={firstDayLabel} pct={firstDayPct} />
      <ProgressCard label="Weekly Progress" pct={weeklyPct} />
      <ProgressCard label="Monthly Progress" pct={monthlyPct} />
      <ProgressCard label="Overall Progress" pct={overallPct} />
      <StreakCard
        label="Current Streak"
        value={streaks.current}
        unit={streaks.current === 1 ? "day" : "days"}
        flame
      />
      <StreakCard
        label="Longest Streak"
        value={streaks.longest}
        unit={streaks.longest === 1 ? "day" : "days"}
      />
      <StreakCard label="Perfect Days" value={perfectDaysCount} unit="total" />
    </div>
  );
}
