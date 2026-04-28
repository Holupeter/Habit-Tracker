import type { Session, User } from '@/types/auth';
import { STORAGE_KEYS } from '@/lib/constants';
import { readJson, removeKey, writeJson } from '@/lib/storage';

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readUsers(): User[] {
  return readJson<User[]>(STORAGE_KEYS.users) ?? [];
}

function writeUsers(users: User[]): void {
  writeJson(STORAGE_KEYS.users, users);
}

export function getSession(): Session | null {
  return readJson<Session | null>(STORAGE_KEYS.session);
}

export function setSession(session: Session | null): void {
  writeJson(STORAGE_KEYS.session, session);
}

export function signup(email: string, password: string): { ok: true } | { ok: false; error: string } {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  if (!trimmedEmail) return { ok: false, error: 'Email is required' };
  if (!trimmedPassword) return { ok: false, error: 'Password is required' };

  const users = readUsers();
  const exists = users.some((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase());
  if (exists) return { ok: false, error: 'User already exists' };

  const user: User = {
    id: newId(),
    email: trimmedEmail,
    password: trimmedPassword,
    createdAt: nowIso(),
  };
  writeUsers([...users, user]);
  setSession({ userId: user.id, email: user.email });
  return { ok: true };
}

export function login(email: string, password: string): { ok: true } | { ok: false; error: string } {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  if (!trimmedEmail) return { ok: false, error: 'Email is required' };
  if (!trimmedPassword) return { ok: false, error: 'Password is required' };

  const users = readUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase() && u.password === trimmedPassword,
  );
  if (!user) return { ok: false, error: 'Invalid email or password' };

  setSession({ userId: user.id, email: user.email });
  return { ok: true };
}

export function logout(): void {
  removeKey(STORAGE_KEYS.session);
}

