import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  created_at: string;
}

export interface StreakInfo {
  current_streak: number;
  best_streak: number;
  last_completed_date: string | null;
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayCompletedIds, setTodayCompletedIds] = useState<Set<string>>(new Set());
  const [streakData, setStreakData] = useState<StreakInfo>({
    current_streak: 0,
    best_streak: 0,
    last_completed_date: null,
  });
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<{ date: string; tasks: string[] }[]>([]);

  const todayStr = getTodayStr();

  // Fetch all data on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Fetch tasks
        const { data: tasksData } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: true });

        // Fetch today's completions
        const { data: completions } = await supabase
          .from("daily_completions")
          .select("task_id")
          .eq("completed_date", todayStr);

        // Fetch streak
        const { data: streak } = await supabase
          .from("streak_data")
          .select("*")
          .eq("id", 1)
          .single();

        // Fetch recent history (last 7 days of completions)
        const { data: historyData } = await supabase
          .from("daily_completions")
          .select("completed_date, task_id, tasks(title)")
          .order("completed_date", { ascending: false })
          .limit(100);

        if (tasksData) setTasks(tasksData);
        if (completions) {
          setTodayCompletedIds(new Set(completions.map((c) => c.task_id)));
        }
        if (streak) {
          // Check for streak break
          let currentStreak = streak.current_streak;
          if (
            streak.last_completed_date &&
            streak.last_completed_date !== todayStr &&
            streak.last_completed_date !== getYesterdayStr()
          ) {
            currentStreak = 0;
            await supabase
              .from("streak_data")
              .update({ current_streak: 0 })
              .eq("id", 1);
          }
          setStreakData({
            current_streak: currentStreak,
            best_streak: streak.best_streak,
            last_completed_date: streak.last_completed_date,
          });
        }

        // Group history by date
        if (historyData) {
          const grouped: Record<string, string[]> = {};
          for (const row of historyData) {
            const date = row.completed_date;
            const taskTitle = (row.tasks as any)?.title || "Unknown";
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(taskTitle);
          }
          const sorted = Object.entries(grouped)
            .map(([date, tasks]) => ({ date, tasks }))
            .sort((a, b) => b.date.localeCompare(a.date));
          setHistory(sorted);
        }
      } catch (err) {
        console.error("Load error:", err);
      }
      setLoading(false);
    }
    load();
  }, [todayStr]);

  const addTask = useCallback(async (title: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert({ title })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add task");
      return;
    }
    if (data) {
      setTasks((prev) => [...prev, data]);
      toast.success("Task added!");
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      toast.error("Failed to remove task");
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setTodayCompletedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success("Task removed");
  }, []);

  const toggleTask = useCallback(
    async (id: string) => {
      const isCompleted = todayCompletedIds.has(id);

      if (isCompleted) {
        // Uncomplete
        const { error } = await supabase
          .from("daily_completions")
          .delete()
          .eq("task_id", id)
          .eq("completed_date", todayStr);

        if (!error) {
          setTodayCompletedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      } else {
        // Complete
        const { error } = await supabase
          .from("daily_completions")
          .insert({ task_id: id, completed_date: todayStr });

        if (!error) {
          setTodayCompletedIds((prev) => new Set(prev).add(id));
        }
      }
    },
    [todayCompletedIds, todayStr]
  );

  const completedCount = todayCompletedIds.size;
  const totalCount = tasks.length;
  const allDoneToday = totalCount > 0 && completedCount === totalCount;
  const todayAlreadyRecorded = streakData.last_completed_date === todayStr;

  const fetchHistory = useCallback(async () => {
    const { data: historyData } = await supabase
      .from("daily_completions")
      .select("completed_date, task_id, tasks(title)")
      .order("completed_date", { ascending: false })
      .limit(100);

    if (historyData) {
      const grouped: Record<string, string[]> = {};
      for (const row of historyData) {
        const date = row.completed_date;
        const taskTitle = (row.tasks as any)?.title || "Unknown";
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(taskTitle);
      }
      const sorted = Object.entries(grouped)
        .map(([date, t]) => ({ date, tasks: t }))
        .sort((a, b) => b.date.localeCompare(a.date));
      setHistory(sorted);
    }
  }, []);

  const completeDayAndUpdateStreak = useCallback(async () => {
    if (!allDoneToday || todayAlreadyRecorded) return;

    const yesterday = getYesterdayStr();
    const continuing =
      streakData.last_completed_date === yesterday ||
      streakData.last_completed_date === todayStr;
    const newStreak = continuing ? streakData.current_streak + 1 : 1;
    const newBest = Math.max(streakData.best_streak, newStreak);

    const { error } = await supabase
      .from("streak_data")
      .update({
        current_streak: newStreak,
        best_streak: newBest,
        last_completed_date: todayStr,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      toast.error("Failed to update streak");
      return;
    }

    setStreakData({
      current_streak: newStreak,
      best_streak: newBest,
      last_completed_date: todayStr,
    });

    // Refresh history to show today's completed day
    await fetchHistory();

    toast.success(`Streak updated to ${newStreak}! 🔥`);
  }, [allDoneToday, todayAlreadyRecorded, streakData, todayStr, fetchHistory]);

  return {
    tasks,
    history,
    streakData,
    todayCompletedIds,
    addTask,
    removeTask,
    toggleTask,
    completedCount,
    totalCount,
    allDoneToday,
    todayAlreadyRecorded,
    completeDayAndUpdateStreak,
    loading,
  };
}
