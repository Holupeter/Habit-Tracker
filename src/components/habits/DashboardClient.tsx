'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout } from '@/lib/auth';
import type { Habit } from '@/types/habit';
import { HabitForm } from '@/components/habits/HabitForm';
import { HabitList } from '@/components/habits/HabitList';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { deleteHabit, getHabitsForUser, readHabits, toggleHabitCompletion, upsertHabit } from '@/lib/habits';

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function DashboardClient() {
  return (
    <ProtectedRoute>
      <DashboardInner />
    </ProtectedRoute>
  );
}

function DashboardInner() {
  const router = useRouter();
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
    <main className="flex-1 p-6 bg-zinc-50">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-black/60">{session.email}</p>
          </div>
          <button
            data-testid="auth-logout-button"
            className="h-10 rounded-md border border-black/15 bg-white px-4 font-medium focus:outline-none focus:ring-2 focus:ring-black/20"
            type="button"
            onClick={() => {
              logout();
              router.replace('/login');
            }}
          >
            Log out
          </button>
        </header>

        <section data-testid="dashboard-page" className="mt-6 grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Your habits</h2>
            <button
              data-testid="create-habit-button"
              className="h-10 rounded-md bg-black px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-black/30"
              type="button"
              onClick={() => {
                setEditingId(null);
                setShowCreate((v) => !v);
              }}
            >
              {showCreate ? 'Close' : 'Create habit'}
            </button>
          </div>

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
            <div
              data-testid="empty-state"
              className="rounded-lg border border-dashed border-black/20 bg-white p-8 text-center text-black/60"
            >
              No habits yet. Create your first habit.
            </div>
          ) : (
            <HabitList
              habits={habits}
              today={today}
              onToggleComplete={(habitId) => {
                const all = readHabits();
                const habit = all.find((h) => h.id === habitId);
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
            <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
              <p className="font-medium">Delete this habit?</p>
              <p className="text-sm text-black/60">This action cannot be undone.</p>
              <div className="mt-3 flex gap-2">
                <button
                  data-testid="confirm-delete-button"
                  className="h-10 rounded-md bg-red-600 px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-700/30"
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
                <button
                  className="h-10 rounded-md border border-black/15 px-4 font-medium focus:outline-none focus:ring-2 focus:ring-black/20"
                  type="button"
                  onClick={() => setDeletingId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

