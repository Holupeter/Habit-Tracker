'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import type { Session } from '@/types/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      const t = setTimeout(() => {
        router.replace('/login');
      }, 0);
      return () => clearTimeout(t);
    }
    setSession(s);
    setChecked(true);
  }, [router]);

  if (!checked) return null;
  if (!session) return null;
  return <>{children}</>;
}

