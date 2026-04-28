import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/lib/slug';

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
  });

  it('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Read   Books  ')).toBe('read-books');
  });

  it('removes non alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Read! Books? Now.')).toBe('read-books-now');
    expect(getHabitSlug('A&B - C')).toBe('ab-c');
  });
});
