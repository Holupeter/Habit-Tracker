import { describe, it, expect, beforeEach } from 'vitest';
import type { Habit } from '@/types/habit';
import { deleteHabit, getHabitsForUser, readHabits, upsertHabit, writeHabits } from '@/lib/habits';

function habit(id: string, userId: string, name: string): Habit {
  return {
    id,
    userId,
    name,
    description: '',
    frequency: 'daily',
    createdAt: '2026-01-01T00:00:00.000Z',
    completions: [],
  };
}

describe('habits storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('writes and reads habits from localStorage', () => {
    writeHabits([habit('h1', 'u1', 'Drink Water')]);
    expect(readHabits().length).toBe(1);
  });

  it('filters habits by user', () => {
    writeHabits([habit('h1', 'u1', 'A'), habit('h2', 'u2', 'B')]);
    expect(getHabitsForUser('u1').map((h) => h.id)).toEqual(['h1']);
  });

  it('upserts habits by id', () => {
    upsertHabit(habit('h1', 'u1', 'A'));
    upsertHabit({ ...habit('h1', 'u1', 'A'), name: 'Updated' });
    expect(readHabits()).toHaveLength(1);
    expect(readHabits()[0]?.name).toBe('Updated');
  });

  it('deletes habits by id', () => {
    writeHabits([habit('h1', 'u1', 'A'), habit('h2', 'u1', 'B')]);
    deleteHabit('h1');
    expect(readHabits().map((h) => h.id)).toEqual(['h2']);
  });
});

