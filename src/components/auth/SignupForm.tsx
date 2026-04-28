'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/auth';

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const result = signup(email, password);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.replace('/dashboard');
      }}
    >
      <div className="grid gap-1">
        <label htmlFor="signup-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="signup-email"
          data-testid="auth-signup-email"
          className="h-10 rounded-md border border-black/15 px-3 outline-none focus:ring-2 focus:ring-black/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="signup-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="signup-password"
          data-testid="auth-signup-password"
          className="h-10 rounded-md border border-black/15 px-3 outline-none focus:ring-2 focus:ring-black/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
        />
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        data-testid="auth-signup-submit"
        className="h-10 rounded-md bg-black text-white font-medium focus:outline-none focus:ring-2 focus:ring-black/30"
        type="submit"
      >
        Sign up
      </button>

      <p className="text-sm text-black/70">
        Already have an account?{' '}
        <a className="underline" href="/login">
          Log in
        </a>
      </p>
    </form>
  );
}

