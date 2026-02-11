import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useTaskManager } from "@/hooks/useTaskManager";
import { StreakCounter } from "@/components/StreakCounter";
import { ProgressRing } from "@/components/ProgressRing";
import { TaskItem } from "@/components/TaskItem";
import { AddTaskInput } from "@/components/AddTaskInput";
import { DayCompleteOverlay } from "@/components/DayCompleteOverlay";
import { HistoryPanel } from "@/components/HistoryPanel";

const Index = () => {
  const {
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
  } = useTaskManager();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <DayCompleteOverlay
        show={allDoneToday}
        alreadyRecorded={todayAlreadyRecorded}
        onConfirm={completeDayAndUpdateStreak}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-4">
            <Zap size={12} className="animate-pulse-neon" />
            Daily Task Tracker
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Streak<span className="text-neon">Hub</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete all tasks daily. Build your streak. Stay consistent.
          </p>
        </motion.header>

        {/* Streak + Progress */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-around gap-6"
        >
          <StreakCounter
            currentStreak={streakData.currentStreak}
            bestStreak={streakData.bestStreak}
          />
          <ProgressRing completed={completedCount} total={totalCount} />
        </motion.section>

        {/* Add Task */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <AddTaskInput onAdd={addTask} />
        </motion.section>

        {/* Task List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Today's Tasks
          </h2>
          {tasks.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No tasks yet. Add some tasks to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onRemove={removeTask}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
          {todayAlreadyRecorded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 rounded-xl bg-success/10 border border-success/20 p-4 text-center"
            >
              <p className="text-sm font-medium text-success">
                ✓ Today is done! Your streak is at {streakData.currentStreak} 🔥
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* History */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Recent History
          </h2>
          <HistoryPanel history={history} />
        </motion.section>
      </div>
    </div>
  );
};

export default Index;
