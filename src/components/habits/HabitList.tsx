import type { Habit } from '@/types/habit';
import { HabitCard } from '@/components/habits/HabitCard';

type Props = {
  habits: Habit[];
  today: string;
  onToggleComplete: (habitId: string) => void;
  onEdit: (habitId: string) => void;
  onDelete: (habitId: string) => void;
};

export function HabitList({ habits, today, onToggleComplete, onEdit, onDelete }: Props) {
  return (
    <div className="grid gap-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          onToggleComplete={() => onToggleComplete(habit.id)}
          onEdit={() => onEdit(habit.id)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </div>
  );
}

