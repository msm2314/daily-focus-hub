import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Task } from "@/hooks/useTaskManager";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TaskItem({ task, onToggle, onRemove }: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      className={`group flex items-center gap-3 rounded-lg p-3 transition-all cursor-pointer ${
        task.completed
          ? "glass border-success/20"
          : "glass hover:border-primary/30"
      }`}
      onClick={() => onToggle(task.id)}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all ${
          task.completed
            ? "border-success bg-success/20"
            : "border-muted-foreground/30"
        }`}
      >
        {task.completed && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Check size={14} className="text-success" />
          </motion.div>
        )}
      </div>

      <span
        className={`flex-1 text-sm font-medium transition-all ${
          task.completed ? "text-muted-foreground line-through" : "text-foreground"
        }`}
      >
        {task.title}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
