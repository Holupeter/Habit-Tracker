import { STORAGE_KEYS } from '@/lib/constants';
import { readJson, writeJson } from '@/lib/storage';
import type { Habit } from '@/types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const hasDate = habit.completions.includes(date);
  const nextCompletions = hasDate
    ? habit.completions.filter((d) => d !== date)
    : [...habit.completions, date];

  const unique = Array.from(new Set(nextCompletions));
  unique.sort();

  return {
    ...habit,
    completions: unique,
  };
}

export function readHabits(): Habit[] {
  return readJson<Habit[]>(STORAGE_KEYS.habits) ?? [];
}

export function writeHabits(habits: Habit[]): void {
  writeJson(STORAGE_KEYS.habits, habits);
}

export function getHabitsForUser(userId: string): Habit[] {
  return readHabits().filter((h) => h.userId === userId);
}

export function upsertHabit(habit: Habit): void {
  const habits = readHabits();
  const idx = habits.findIndex((h) => h.id === habit.id);
  const next = idx === -1 ? [...habits, habit] : habits.map((h) => (h.id === habit.id ? habit : h));
  writeHabits(next);
}

export function deleteHabit(id: string): void {
  const habits = readHabits();
  writeHabits(habits.filter((h) => h.id !== id));
}
