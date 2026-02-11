import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakCounter({ currentStreak, bestStreak }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-8">
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-streak"
          >
            <Flame size={48} className="drop-shadow-[0_0_15px_hsl(var(--streak)/0.6)]" />
          </motion.div>
          <motion.span
            key={currentStreak}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -bottom-1 -right-2 font-mono text-2xl font-bold streak-glow"
          >
            {currentStreak}
          </motion.span>
        </div>
        <span className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Current Streak
        </span>
      </motion.div>

      <div className="h-12 w-px bg-border" />

      <div className="flex flex-col items-center">
        <span className="font-mono text-2xl font-bold text-neon">{bestStreak}</span>
        <span className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Best Streak
        </span>
      </div>
    </div>
  );
}
