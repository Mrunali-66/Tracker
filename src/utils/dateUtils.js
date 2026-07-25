export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

export function keyOf(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

export function dateAtMidnight(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function parseKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// The tracked window: tomorrow (relative to whenever the app is opened)
// through December 31 of that year.
export function getTrackedRange() {
  const realToday = dateAtMidnight(new Date());
  const trackStart = new Date(realToday);
  trackStart.setDate(trackStart.getDate() + 1);
  let rangeEnd = new Date(trackStart.getFullYear(), 11, 31);
  if (rangeEnd.getTime() < trackStart.getTime()) {
    rangeEnd = new Date(trackStart.getFullYear() + 1, 11, 31);
  }
  return { realToday, trackStart, rangeEnd };
}

export function buildTrackedKeys(trackStart, rangeEnd) {
  const keys = [];
  const cur = new Date(trackStart);
  while (cur.getTime() <= rangeEnd.getTime()) {
    keys.push(keyOf(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return keys;
}

export function buildMonthList(trackStart, rangeEnd) {
  const list = [];
  const cursor = new Date(trackStart.getFullYear(), trackStart.getMonth(), 1);
  const last = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);
  while (cursor.getTime() <= last.getTime()) {
    list.push({ year: cursor.getFullYear(), month: cursor.getMonth() });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return list;
}

export function weekKeysFor(d, trackedKeySet) {
  const dow = d.getDay();
  const monStart = new Date(d);
  const diff = dow === 0 ? -6 : 1 - dow;
  monStart.setDate(monStart.getDate() + diff);
  const keys = [];
  for (let i = 0; i < 7; i++) {
    const dd = new Date(monStart);
    dd.setDate(dd.getDate() + i);
    const k = keyOf(dd);
    if (trackedKeySet.has(k)) keys.push(k);
  }
  return keys;
}
