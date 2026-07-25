import React from "react";

export default function Legend() {
  return (
    <div className="legend">
      <div className="legend-item">
        <span className="dot green"></span> All tasks completed
      </div>
      <div className="legend-item">
        <span className="dot yellow"></span> More than 50% completed
      </div>
      <div className="legend-item">
        <span className="dot gray"></span> No tasks completed
      </div>
    </div>
  );
}
