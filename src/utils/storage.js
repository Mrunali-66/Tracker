const STORAGE_KEY = "habit-tracker-data-v1";

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw);
    if (parsed && parsed.days) return parsed;
    return { days: {} };
  } catch (e) {
    console.error("Failed to load habit data", e);
    return { days: {} };
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save habit data", e);
  }
}

export function exportBackup(data, tasks, trackStartKey, rangeEndKey) {
  const payload = {
    exportedAt: new Date().toISOString(),
    trackedRange: { start: trackStartKey, end: rangeEndKey },
    tasks,
    days: data.days,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "growth-log-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
