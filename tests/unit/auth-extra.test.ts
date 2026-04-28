import { describe, it, expect, beforeEach } from 'vitest';
import { STORAGE_KEYS } from '@/lib/constants';
import { getSession, login, logout, signup } from '@/lib/auth';

describe('auth helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('signs up and creates a session', () => {
    const result = signup('test@example.com', 'password');
    expect(result.ok).toBe(true);
    expect(getSession()).not.toBeNull();
  });

  it('rejects duplicate signup emails', () => {
    expect(signup('dup@example.com', 'password').ok).toBe(true);
    const second = signup('dup@example.com', 'password');
    expect(second).toEqual({ ok: false, error: 'User already exists' });
  });

  it('logs in an existing user and sets session', () => {
    expect(signup('user@example.com', 'password').ok).toBe(true);
    window.localStorage.removeItem(STORAGE_KEYS.session);
    expect(login('user@example.com', 'password').ok).toBe(true);
    expect(getSession()).not.toBeNull();
  });

  it('shows invalid login for wrong credentials', () => {
    expect(signup('user@example.com', 'password').ok).toBe(true);
    window.localStorage.removeItem(STORAGE_KEYS.session);
    expect(login('user@example.com', 'wrong')).toEqual({ ok: false, error: 'Invalid email or password' });
  });

  it('logs out by removing session from localStorage', () => {
    expect(signup('user@example.com', 'password').ok).toBe(true);
    expect(window.localStorage.getItem(STORAGE_KEYS.session)).not.toBeNull();
    logout();
    expect(window.localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });
});

