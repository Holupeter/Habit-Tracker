'use client';

import type { Habit } from '@/types/habit';
import { calculateCurrentStreak } from '@/lib/streaks';
import { getHabitSlug } from '@/lib/slug';

type Props = {
  habit: Habit;
  today: string;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function HabitCard({ habit, today, onToggleComplete, onEdit, onDelete }: Props) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const completedToday = habit.completions.includes(today);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="rounded-lg border border-black/10 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{habit.name}</h3>
          {habit.description ? <p className="text-sm text-black/70">{habit.description}</p> : null}
        </div>
        <div className="flex gap-2">
          <button
            data-testid={`habit-edit-${slug}`}
            className="h-9 rounded-md border border-black/15 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/20"
            type="button"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            data-testid={`habit-delete-${slug}`}
            className="h-9 rounded-md border border-black/15 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/20"
            type="button"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="text-sm">
          <span className="text-black/70">Current streak: </span>
          <span data-testid={`habit-streak-${slug}`} className="font-semibold">
            {streak}
          </span>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          className={`h-10 rounded-md px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/20 ${
            completedToday ? 'bg-green-600 text-white' : 'bg-black text-white'
          }`}
          type="button"
          onClick={onToggleComplete}
        >
          {completedToday ? 'Completed' : 'Complete today'}
        </button>
      </div>
    </div>
  );
}

