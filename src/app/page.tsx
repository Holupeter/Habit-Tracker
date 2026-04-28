'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { SplashScreen } from '@/components/shared/SplashScreen';

export default function Home() {
  return <SplashRedirect />;
}

function SplashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    const t = window.setTimeout(() => {
      router.replace(session ? '/dashboard' : '/login');
    }, 1000);
    return () => window.clearTimeout(t);
  }, [router]);

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <SplashScreen />
    </main>
  );
}
