import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakCounter({ currentStreak, bestStreak }: StreakCounterProps) {
  // Generate fire icons based on streak count (max 10 shown)
  const fireCount = Math.min(currentStreak, 10);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Fire icons row */}
      <div className="flex items-end gap-1">
        {fireCount > 0 ? (
          Array.from({ length: fireCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
            >
              <Flame
                size={20 + (i < 3 ? i * 4 : 8)}
                className="text-streak drop-shadow-[0_0_8px_hsl(var(--streak)/0.6)]"
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame size={36} className="text-muted-foreground" />
          </motion.div>
        )}
      </div>

      {/* Streak number */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <motion.span
            key={currentStreak}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-mono text-4xl font-bold streak-glow"
          >
            {currentStreak}
          </motion.span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Current Streak
          </span>
        </div>

        <div className="h-10 w-px bg-border" />

        <div className="flex flex-col items-center">
          <span className="font-mono text-2xl font-bold text-neon">{bestStreak}</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Best Streak
          </span>
        </div>
      </div>

      {currentStreak > 0 && currentStreak >= 10 && (
        <span className="text-xs text-muted-foreground">+ {currentStreak - 10} more 🔥</span>
      )}
    </div>
  );
}
