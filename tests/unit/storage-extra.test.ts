import { describe, it, expect, beforeEach } from 'vitest';
import { readJson, removeKey, writeJson } from '@/lib/storage';

describe('storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('writes and reads JSON values', () => {
    writeJson('k', { a: 1 });
    expect(readJson<{ a: number }>('k')).toEqual({ a: 1 });
  });

  it('returns null for missing keys or invalid JSON', () => {
    expect(readJson('missing')).toBeNull();
    window.localStorage.setItem('bad', '{');
    expect(readJson('bad')).toBeNull();
  });

  it('removes keys', () => {
    writeJson('k', { ok: true });
    removeKey('k');
    expect(readJson('k')).toBeNull();
  });
});

