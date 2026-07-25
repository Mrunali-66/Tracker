import React from "react";
import { MONTH_NAMES } from "../utils/dateUtils.js";

export default function RangeBanner({ trackStart, rangeEnd, dayCount }) {
  return (
    <div className="range-banner">
      Tracking{" "}
      <b>
        {MONTH_NAMES[trackStart.getMonth()]} {trackStart.getDate()},{" "}
        {trackStart.getFullYear()}
      </b>{" "}
      <span className="sep">→</span>{" "}
      <b>
        {MONTH_NAMES[rangeEnd.getMonth()]} {rangeEnd.getDate()},{" "}
        {rangeEnd.getFullYear()}
      </b>{" "}
      <span className="sep">·</span> {dayCount} days · 20 habits each
    </div>
  );
}
