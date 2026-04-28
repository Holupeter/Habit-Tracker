export function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}

