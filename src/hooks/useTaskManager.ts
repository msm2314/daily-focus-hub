import { useState, useEffect, useCallback } from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface DayRecord {
  date: string;
  tasks: Task[];
  allDone: boolean;
}

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null;
}

const TASKS_KEY = "streak-tasks";
const HISTORY_KEY = "streak-history";
const STREAK_KEY = "streak-data";

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>(() => loadJSON(TASKS_KEY, []));
  const [history, setHistory] = useState<DayRecord[]>(() => loadJSON(HISTORY_KEY, []));
  const [streakData, setStreakData] = useState<StreakData>(() =>
    loadJSON(STREAK_KEY, { currentStreak: 0, bestStreak: 0, lastCompletedDate: null })
  );

  // Persist
  useEffect(() => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem(HISTORY_KEY, JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem(STREAK_KEY, JSON.stringify(streakData)), [streakData]);

  const addTask = useCallback((title: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const todayStr = getTodayStr();
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const allDoneToday = totalCount > 0 && completedCount === totalCount;
  const todayAlreadyRecorded = streakData.lastCompletedDate === todayStr;

  // Mark day as complete
  const completeDayAndUpdateStreak = useCallback(() => {
    if (!allDoneToday || todayAlreadyRecorded) return;

    const dayRecord: DayRecord = {
      date: todayStr,
      tasks: tasks.map((t) => ({ ...t })),
      allDone: true,
    };

    setHistory((prev) => {
      const filtered = prev.filter((d) => d.date !== todayStr);
      return [dayRecord, ...filtered];
    });

    setStreakData((prev) => {
      const yesterday = getYesterdayStr();
      const continuing = prev.lastCompletedDate === yesterday || prev.lastCompletedDate === todayStr;
      const newStreak = continuing ? prev.currentStreak + 1 : 1;
      return {
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        lastCompletedDate: todayStr,
      };
    });

    // Reset tasks for next day
    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
  }, [allDoneToday, todayAlreadyRecorded, todayStr, tasks]);

  // Auto-check streak break
  useEffect(() => {
    if (streakData.lastCompletedDate && streakData.lastCompletedDate !== todayStr && streakData.lastCompletedDate !== getYesterdayStr()) {
      setStreakData((prev) => ({ ...prev, currentStreak: 0 }));
    }
  }, [todayStr, streakData.lastCompletedDate]);

  return {
    tasks,
    history,
    streakData,
    addTask,
    removeTask,
    toggleTask,
    completedCount,
    totalCount,
    allDoneToday,
    todayAlreadyRecorded,
    completeDayAndUpdateStreak,
  };
}
