'use client';

import { memo, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, Navbar } from '@/components/common/Sidebar';
import { PageLoader } from '@/components/common/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { initializeAuth } from '@/store/authSlice';
import { selectIsAuthenticated } from '@/store/selectors';
import { ROUTES } from '@/constants';

export const DashboardLayout = memo(function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(initializeAuth()).finally(() => setInitializing(false));
  }, [dispatch]);

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [initializing, isAuthenticated, router]);

  if (initializing) return <PageLoader />;
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
});
