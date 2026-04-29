'use client';

import { useEffect, useState } from 'react';
import type { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';

type Props = {
  initial?: Pick<Habit, 'name' | 'description'>;
  onCancel?: () => void;
  onSave: (value: { name: string; description: string }) => void;
};

export function HabitForm({ initial, onCancel, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initial?.name ?? '');
    setDescription(initial?.description ?? '');
    setError(null);
  }, [initial?.name, initial?.description]);

  return (
    <form
      data-testid="habit-form"
      className="grid gap-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const result = validateHabitName(name);
        if (!result.valid) {
          setError(result.error);
          return;
        }
        setError(null);
        onSave({ name: result.value, description: description.trim() });
      }}
    >
      <div className="grid gap-1">
        <label htmlFor="habit-name" className="text-sm font-medium">
          Habit name
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          className="h-10 rounded-md border border-black/15 dark:border-white/15 px-3 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 dark:bg-zinc-900"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="habit-description" className="text-sm font-medium">
          Description
        </label>
        <input
          id="habit-description"
          data-testid="habit-description-input"
          className="h-10 rounded-md border border-black/15 dark:border-white/15 px-3 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 dark:bg-zinc-900"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="habit-frequency" className="text-sm font-medium">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          className="h-10 rounded-md border border-black/15 dark:border-white/15 px-3 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          defaultValue="daily"
          disabled
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex gap-2">
        <button
          data-testid="habit-save-button"
          className="h-10 flex-1 rounded-md bg-black dark:bg-white text-white dark:text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30"
          type="submit"
        >
          Save
        </button>
        {onCancel ? (
          <button
            className="h-10 rounded-md border border-black/15 dark:border-white/15 px-4 font-medium focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

