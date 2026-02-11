import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";

interface DayCompleteOverlayProps {
  show: boolean;
  onConfirm: () => void;
  alreadyRecorded: boolean;
}

export function DayCompleteOverlay({ show, onConfirm, alreadyRecorded }: DayCompleteOverlayProps) {
  if (!show || alreadyRecorded) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="glass neon-border rounded-2xl p-8 text-center max-w-sm mx-4"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <PartyPopper size={56} className="mx-auto text-streak drop-shadow-[0_0_20px_hsl(var(--streak)/0.5)]" />
          </motion.div>
          <h2 className="mt-4 text-2xl font-bold text-foreground">All Tasks Done!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Amazing work! Complete the day to increase your streak.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="mt-6 rounded-lg bg-streak px-6 py-3 font-semibold text-streak-foreground shadow-[0_0_20px_hsl(var(--streak)/0.4)] transition-all hover:brightness-110"
          >
            Complete Day & Streak 🔥
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
