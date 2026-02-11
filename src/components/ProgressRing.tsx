import { motion } from "framer-motion";

interface ProgressRingProps {
  completed: number;
  total: number;
}

export function ProgressRing({ completed, total }: ProgressRingProps) {
  const pct = total === 0 ? 0 : (completed / total) * 100;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const allDone = total > 0 && completed === total;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="6"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={allDone ? "hsl(var(--success))" : "hsl(var(--primary))"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            filter: allDone
              ? "drop-shadow(0 0 8px hsl(var(--success)/0.5))"
              : "drop-shadow(0 0 8px hsl(var(--primary)/0.4))",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-3xl font-bold text-foreground">
          {completed}/{total}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {allDone ? "Complete!" : "Tasks"}
        </span>
      </div>
    </div>
  );
}
