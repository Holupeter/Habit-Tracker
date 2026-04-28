import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { STORAGE_KEYS } from '@/lib/constants';
import type { Habit } from '@/types/habit';
import { HabitForm } from '@/components/habits/HabitForm';
import { HabitList } from '@/components/habits/HabitList';
import { deleteHabit, getHabitsForUser, readHabits, toggleHabitCompletion, upsertHabit } from '@/lib/habits';
import { getSession } from '@/lib/auth';
import { useMemo, useState } from 'react';

function setSession(userId: string, email = 'user@example.com') {
  window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ userId, email }));
}

function getHabits(): Habit[] {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) ?? '[]') as Habit[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function HabitDashboardHarness() {
  const session = getSession();
  const today = todayIso();
  const [refresh, setRefresh] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const habits = useMemo(() => {
    if (!session) return [];
    return getHabitsForUser(session.userId);
  }, [session?.userId, refresh]);

  const editingHabit = useMemo(() => {
    if (!editingId) return null;
    return readHabits().find((h) => h.id === editingId) ?? null;
  }, [editingId, refresh]);

  if (!session) return null;

  return (
    <div>
      <section data-testid="dashboard-page">
        <button
          data-testid="create-habit-button"
          type="button"
          onClick={() => {
            setEditingId(null);
            setShowCreate((v) => !v);
          }}
        >
          Create habit
        </button>

        {showCreate ? (
          <HabitForm
            onSave={({ name, description }) => {
              const habit: Habit = {
                id: newId(),
                userId: session.userId,
                name,
                description,
                frequency: 'daily',
                createdAt: nowIso(),
                completions: [],
              };
              upsertHabit(habit);
              setShowCreate(false);
              setRefresh((n) => n + 1);
            }}
          />
        ) : null}

        {editingHabit ? (
          <HabitForm
            initial={{ name: editingHabit.name, description: editingHabit.description }}
            onCancel={() => setEditingId(null)}
            onSave={({ name, description }) => {
              upsertHabit({
                ...editingHabit,
                name,
                description,
                frequency: 'daily',
              });
              setEditingId(null);
              setRefresh((n) => n + 1);
            }}
          />
        ) : null}

        {habits.length === 0 ? (
          <div data-testid="empty-state">Empty</div>
        ) : (
          <HabitList
            habits={habits}
            today={today}
            onToggleComplete={(habitId) => {
              const habit = readHabits().find((h) => h.id === habitId);
              if (!habit) return;
              const updated = toggleHabitCompletion(habit, today);
              upsertHabit(updated);
              setRefresh((n) => n + 1);
            }}
            onEdit={(habitId) => {
              setShowCreate(false);
              setDeletingId(null);
              setEditingId(habitId);
            }}
            onDelete={(habitId) => {
              setDeletingId(habitId);
            }}
          />
        )}

        {deletingId ? (
          <button
            data-testid="confirm-delete-button"
            type="button"
            onClick={() => {
              deleteHabit(deletingId);
              setDeletingId(null);
              setEditingId(null);
              setRefresh((n) => n + 1);
            }}
          >
            Confirm delete
          </button>
        ) : null}
      </section>
    </div>
  );
}

describe('habit form', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setSession('u1');
  });

  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    render(<HabitDashboardHarness />);

    await user.click(await screen.findByTestId('create-habit-button'));
    await user.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByText('Habit name is required')).toBeInTheDocument();
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    render(<HabitDashboardHarness />);

    await user.click(await screen.findByTestId('create-habit-button'));
    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.type(screen.getByTestId('habit-description-input'), 'Daily');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    expect(getHabits().length).toBe(1);
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup();
    render(<HabitDashboardHarness />);

    await user.click(await screen.findByTestId('create-habit-button'));
    await user.type(screen.getByTestId('habit-name-input'), 'Read Books');
    await user.click(screen.getByTestId('habit-save-button'));

    const before = getHabits()[0]!;

    await user.click(screen.getByTestId('habit-edit-read-books'));
    await user.clear(screen.getByTestId('habit-name-input'));
    await user.type(screen.getByTestId('habit-name-input'), 'Read More Books');
    await user.click(screen.getByTestId('habit-save-button'));

    const after = getHabits()[0]!;
    expect(after.id).toBe(before.id);
    expect(after.userId).toBe(before.userId);
    expect(after.createdAt).toBe(before.createdAt);
    expect(after.completions).toEqual(before.completions);
    expect(after.name).toBe('Read More Books');
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup();
    render(<HabitDashboardHarness />);

    await user.click(await screen.findByTestId('create-habit-button'));
    await user.type(screen.getByTestId('habit-name-input'), 'Meditate');
    await user.click(screen.getByTestId('habit-save-button'));

    expect(getHabits().length).toBe(1);
    await user.click(screen.getByTestId('habit-delete-meditate'));
    expect(getHabits().length).toBe(1);

    await user.click(screen.getByTestId('confirm-delete-button'));
    expect(getHabits().length).toBe(0);
  });

  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup();
    render(<HabitDashboardHarness />);

    await user.click(await screen.findByTestId('create-habit-button'));
    await user.type(screen.getByTestId('habit-name-input'), 'Run');
    await user.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByTestId('habit-streak-run').textContent).toBe('0');
    await user.click(screen.getByTestId('habit-complete-run'));
    expect(screen.getByTestId('habit-streak-run').textContent).toBe('1');
  });
});
