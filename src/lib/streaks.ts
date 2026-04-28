function uniqueSortedDates(dates: string[]): string[] {
  const unique = Array.from(new Set(dates));
  unique.sort();
  return unique;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function calculateCurrentStreak(completions: string[], today?: string): number {
  const currentDay = today ?? new Date().toISOString().slice(0, 10);
  const dates = uniqueSortedDates(completions);
  const completed = new Set(dates);

  if (!completed.has(currentDay)) return 0;

  let streak = 0;
  let cursor = currentDay;
  while (completed.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

