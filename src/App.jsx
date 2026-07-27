import React, { useState, useRef, useCallback, useEffect } from "react";
import Header from "./components/Header.jsx";
import RangeBanner from "./components/RangeBanner.jsx";
import StatsBar from "./components/StatsBar.jsx";
import Legend from "./components/Legend.jsx";
import MonthTabs from "./components/MonthTabs.jsx";
import Calendar from "./components/Calendar.jsx";
import DayModal from "./components/DayModal.jsx";
import History from "./components/History.jsx";
import Confetti from "./components/Confetti.jsx";
import Toast from "./components/Toast.jsx";
import { useHabitData } from "./hooks/useHabitData.js";
import { keyOf } from "./utils/dateUtils.js";
import { exportBackup } from "./utils/storage.js";

export default function App() {
  const {
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
  } = useHabitData();

  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [openKey, setOpenKey] = useState(null);
  const [celebratingKey, setCelebratingKey] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const confettiRef = useRef(null);
  const wasCompleteRef = useRef({});

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const handleToggle = useCallback(
    (key, idx) => {
      const before = isDayComplete(key);
      toggleTask(key, idx);
      // Compare against the state just before this toggle; the transition
      // to 100% is what should trigger the celebration, not every click.
      setTimeout(() => {
        // isDayComplete reflects state after the toggle has applied.
      }, 0);
      wasCompleteRef.current[key] = before;
    },
    [isDayComplete, toggleTask]
  );

  // After each render, check whether the currently-open day just crossed
  // into "complete" and fire the celebration exactly once for that crossing.
  useEffect(() => {
    if (!openKey) return;
    const nowComplete = isDayComplete(openKey);
    const wasComplete = wasCompleteRef.current[openKey];
    if (wasComplete === false && nowComplete) {
      setCelebratingKey(openKey);
      confettiRef.current?.fire();
      setTimeout(() => setCelebratingKey(null), 600);
    }
    wasCompleteRef.current[openKey] = nowComplete;
  }, [data, openKey, isDayComplete]);

  const openModal = useCallback(
    (key) => {
      wasCompleteRef.current[key] = isDayComplete(key);
      setOpenKey(key);
    },
    [isDayComplete]
  );

  const closeModal = useCallback(() => setOpenKey(null), []);

  const handleExport = useCallback(() => {
    exportBackup(data, TASKS, keyOf(trackStart), keyOf(rangeEnd));
    showToast("Backup downloaded ✓");
  }, [data, TASKS, trackStart, rangeEnd, showToast]);

  const handleShowHistory = useCallback(() => setShowHistory(true), []);
const activeMonth = monthList[activeMonthIndex];
  const activeMonthKeys = activeMonth
    ? monthKeysFor(activeMonth.year, activeMonth.month)
    : [];
  const activeMonthPct = activeMonthKeys.length ? avgPctForKeys(activeMonthKeys) : 0;

  const firstLabel = isTomorrowLabel ? "Tomorrow's Progress" : "First Day Progress";

  return (
    <div className="wrap">
      <Header realToday={realToday} onExport={handleExport} onShowHistory={handleShowHistory} />

      <RangeBanner
        trackStart={trackStart}
        rangeEnd={rangeEnd}
        dayCount={trackedKeys.length}
      />

      <StatsBar
        firstDayLabel={firstLabel}
        firstDayPct={firstDayPct}
        weeklyPct={weeklyPct}
        monthlyPct={monthlyPct}
        overallPct={overallPct}
        streaks={streaks}
        perfectDaysCount={perfectDaysCount}
      />

      <Legend />

      <MonthTabs
        monthList={monthList}
        activeIndex={activeMonthIndex}
        onSelect={setActiveMonthIndex}
        trackStartYear={trackStart.getFullYear()}
      />

      {showHistory ? (
        <History
          trackedKeys={trackedKeys}
          dayPct={dayPct}
          onDayClick={openModal}
          onBack={() => setShowHistory(false)}
        />
      ) : (
        activeMonth && (
          <Calendar
            year={activeMonth.year}
            month={activeMonth.month}
            trackStart={trackStart}
            rangeEnd={rangeEnd}
            realToday={realToday}
            dayPct={dayPct}
            monthPct={activeMonthPct}
            onDayClick={openModal}
            celebratingKey={celebratingKey}
          />
        )
      )}

      <footer className="note">
        Everything you check is saved automatically on this device — works
        fully offline.
      </footer>

      <DayModal
        dayKey={openKey}
        isOpen={!!openKey}
        tasks={TASKS}
        taskStates={openKey ? getDayTasks(openKey) : []}
        pct={openKey ? dayPct(openKey) : 0}
        isComplete={openKey ? isDayComplete(openKey) : false}
        isStartDay={openKey === keyOf(trackStart)}
        onToggle={(idx) => openKey && handleToggle(openKey, idx)}
        onClose={closeModal}
      />

      <Confetti ref={confettiRef} />
      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
