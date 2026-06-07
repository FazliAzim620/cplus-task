'use client';

import { memo, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { initializeAuth } from '@/store/authSlice';
import { selectIsAuthenticated } from '@/store/selectors';
import { ROUTES } from '@/constants';
import { PageLoader } from '@/components/common/Loader';

export const AuthLayout = memo(function AuthLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    dispatch(initializeAuth()).finally(() => setInitializing(false));
  }, [dispatch]);

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [initializing, isAuthenticated, router]);

  if (initializing || isAuthenticated) return <PageLoader />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
});
