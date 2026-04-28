export function getHabitSlug(name: string): string {
  const trimmed = name.trim().toLowerCase();
  const collapsed = trimmed.replace(/\s+/g, '-');
  const cleaned = collapsed.replace(/[^a-z0-9-]/g, '');
  return cleaned;
}

