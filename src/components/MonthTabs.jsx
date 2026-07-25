import React from "react";
import { MONTH_NAMES } from "../utils/dateUtils.js";

export default function MonthTabs({ monthList, activeIndex, onSelect, trackStartYear }) {
  return (
    <div className="month-tabs">
      {monthList.map((m, idx) => (
        <button
          key={m.year + "-" + m.month}
          className={"month-tab" + (idx === activeIndex ? " active" : "")}
          onClick={() => onSelect(idx)}
        >
          <span className="tab-dot"></span>
          {MONTH_NAMES[m.month].slice(0, 3)}
          {m.year !== trackStartYear ? " '" + String(m.year).slice(2) : ""}
        </button>
      ))}
    </div>
  );
}
