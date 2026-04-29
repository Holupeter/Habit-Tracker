'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const result = login(email, password);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.replace('/dashboard');
      }}
    >
      <div className="grid gap-1">
        <label htmlFor="login-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="login-email"
          data-testid="auth-login-email"
          className="h-10 rounded-md border border-black/15 dark:border-white/15 px-3 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 dark:bg-zinc-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="login-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="login-password"
          data-testid="auth-login-password"
          className="h-10 rounded-md border border-black/15 dark:border-white/15 px-3 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 dark:bg-zinc-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
        />
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        data-testid="auth-login-submit"
        className="h-10 rounded-md bg-black dark:bg-white text-white dark:text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30"
        type="submit"
      >
        Log in
      </button>

      <p className="text-sm text-black/70 dark:text-white/70">
        Need an account?{' '}
        <a className="underline" href="/signup">
          Sign up
        </a>
      </p>
    </form>
  );
}

