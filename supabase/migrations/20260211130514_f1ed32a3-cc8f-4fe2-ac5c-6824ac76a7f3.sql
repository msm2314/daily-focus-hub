
-- Tasks: added once, persist forever
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily completions: tracks which tasks are done on which day
CREATE TABLE public.daily_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(task_id, completed_date)
);

-- Streak tracking
CREATE TABLE public.streak_data (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default streak row
INSERT INTO public.streak_data (id, current_streak, best_streak) VALUES (1, 0, 0);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_data ENABLE ROW LEVEL SECURITY;

-- Public access (no auth, single user app)
CREATE POLICY "Public read/write tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write completions" ON public.daily_completions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write streak" ON public.streak_data FOR ALL USING (true) WITH CHECK (true);

-- Index for fast daily lookups
CREATE INDEX idx_daily_completions_date ON public.daily_completions(completed_date);
