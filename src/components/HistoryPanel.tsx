import { motion } from "framer-motion";

interface HistoryPanelProps {
  history: { date: string; tasks: string[] }[];
}

export function HistoryPanel({ history }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">No completed days yet. Start your streak!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.slice(0, 7).map((day, i) => (
        <motion.div
          key={day.date}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-primary">
              {new Date(day.date + "T00:00").toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs font-medium text-success">
              ✓ {day.tasks.length} tasks
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {day.tasks.map((title, j) => (
              <span
                key={j}
                className="rounded-md bg-success/10 px-2 py-0.5 text-[11px] text-success"
              >
                {title}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
