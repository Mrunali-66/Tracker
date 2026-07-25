import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TASKS } from "../data/tasks.js";
import {
  getTrackedRange,
  buildTrackedKeys,
  buildMonthList,
  weekKeysFor,
  parseKey,
  keyOf,
} from "../utils/dateUtils.js";
import { loadData, saveData } from "../utils/storage.js";

export function useHabitData() {
  const range = useMemo(() => getTrackedRange(), []);
  const { realToday, trackStart, rangeEnd } = range;

  const trackedKeys = useMemo(
    () => buildTrackedKeys(trackStart, rangeEnd),
    [trackStart, rangeEnd]
  );
  const trackedKeySet = useMemo(() => new Set(trackedKeys), [trackedKeys]);
  const monthList = useMemo(
    () => buildMonthList(trackStart, rangeEnd),
    [trackStart, rangeEnd]
  );

  const [data, setData] = useState(() => loadData());
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveData(data);
  }, [data]);

  const dayCompletionCount = useCallback(
    (key) => {
      const d = data.days[key];
      if (!d) return 0;
      return d.tasks.filter(Boolean).length;
    },
    [data]
  );

  const dayPct = useCallback(
    (key) => Math.round((dayCompletionCount(key) / TASKS.length) * 100),
    [dayCompletionCount]
  );

  const isDayComplete = useCallback(
    (key) => dayCompletionCount(key) === TASKS.length,
    [dayCompletionCount]
  );

  const getDayTasks = useCallback(
    (key) => data.days[key]?.tasks ?? new Array(TASKS.length).fill(false),
    [data]
  );

  const toggleTask = useCallback((key, idx) => {
    setData((prev) => {
      const prevTasks = prev.days[key]?.tasks ?? new Array(TASKS.length).fill(false);
      const nextTasks = prevTasks.slice();
      nextTasks[idx] = !nextTasks[idx];
      return {
        ...prev,
        days: {
          ...prev.days,
          [key]: { tasks: nextTasks },
        },
      };
    });
  }, []);

  const elapsedKeys = useCallback(
    (keys) => {
      const e = keys.filter((k) => parseKey(k).getTime() <= realToday.getTime());
      if (e.length === 0 && keys.length > 0) return [keys[0]];
      return e;
    },
    [realToday]
  );

  const avgPctForKeys = useCallback(
    (keys) => {
      const e = elapsedKeys(keys);
      if (e.length === 0) return 0;
      const sum = e.reduce((acc, k) => acc + dayPct(k), 0);
      return Math.round(sum / e.length);
    },
    [elapsedKeys, dayPct]
  );

  const monthKeysFor = useCallback(
    (year, month) =>
      trackedKeys.filter((k) => {
        const d = parseKey(k);
        return d.getFullYear() === year && d.getMonth() === month;
      }),
    [trackedKeys]
  );

  const streaks = useMemo(() => {
    let current = 0;
    for (const k of trackedKeys) {
      if (isDayComplete(k)) current++;
      else break;
    }
    let longest = 0;
    let run = 0;
    for (const k of trackedKeys) {
      if (isDayComplete(k)) {
        run++;
        if (run > longest) longest = run;
      } else {
        run = 0;
      }
    }
    return { current, longest };
  }, [trackedKeys, isDayComplete]);

  const perfectDaysCount = useMemo(
    () => trackedKeys.filter((k) => isDayComplete(k)).length,
    [trackedKeys, isDayComplete]
  );

  const overallPct = useMemo(() => avgPctForKeys(trackedKeys), [avgPctForKeys, trackedKeys]);

  const weeklyPct = useMemo(() => {
    const ek = elapsedKeys(trackedKeys);
    const refDate = ek.length ? parseKey(ek[ek.length - 1]) : trackStart;
    return avgPctForKeys(weekKeysFor(refDate, trackedKeySet));
  }, [elapsedKeys, trackedKeys, trackStart, avgPctForKeys, trackedKeySet]);

  const monthlyPct = useMemo(() => {
    const ek = elapsedKeys(trackedKeys);
    const refDate = ek.length ? parseKey(ek[ek.length - 1]) : trackStart;
    return avgPctForKeys(monthKeysFor(refDate.getFullYear(), refDate.getMonth()));
  }, [elapsedKeys, trackedKeys, trackStart, avgPctForKeys, monthKeysFor]);

  const firstDayPct = useMemo(
    () => dayPct(trackedKeys[0]),
    [dayPct, trackedKeys]
  );

  const isTomorrowLabel = useMemo(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    return trackStart.getTime() - realToday.getTime() === oneDay;
  }, [trackStart, realToday]);

  return {
    TASKS,
    realToday,
    trackStart,
    rangeEnd,
    trackedKeys,
    monthList,
    data,
    getDayTasks,
    dayPct,
    isDayComplete,
    toggleTask,
    monthKeysFor,
    avgPctForKeys,
    streaks,
    perfectDaysCount,
    overallPct,
    weeklyPct,
    monthlyPct,
    firstDayPct,
    isTomorrowLabel,
  };
}
