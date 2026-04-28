import { describe, it, expect } from 'vitest';
import type { Habit } from '@/types/habit';
import { toggleHabitCompletion } from '@/lib/habits';

function habitFixture(completions: string[]): Habit {
  return {
    id: 'h1',
    userId: 'u1',
    name: 'Drink Water',
    description: '',
    frequency: 'daily',
    createdAt: '2026-01-01T00:00:00.000Z',
    completions,
  };
}

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const habit = habitFixture([]);
    const updated = toggleHabitCompletion(habit, '2026-01-02');
    expect(updated.completions).toContain('2026-01-02');
  });

  it('removes a completion date when the date already exists', () => {
    const habit = habitFixture(['2026-01-02']);
    const updated = toggleHabitCompletion(habit, '2026-01-02');
    expect(updated.completions).toEqual([]);
  });

  it('does not mutate the original habit object', () => {
    const habit = habitFixture([]);
    const updated = toggleHabitCompletion(habit, '2026-01-02');
    expect(habit.completions).toEqual([]);
    expect(updated).not.toBe(habit);
  });

  it('does not return duplicate completion dates', () => {
    const habit = habitFixture(['2026-01-02']);
    const updated = toggleHabitCompletion(habit, '2026-01-03');
    const updated2 = toggleHabitCompletion(updated, '2026-01-03');
    expect(updated2.completions).toEqual(['2026-01-02']);
  });
});

