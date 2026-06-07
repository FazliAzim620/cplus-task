'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { ROUTES, APP_NAME } from '@/constants';
import { useTheme } from '@/providers/ThemeProvider';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { logout } from '@/store/authSlice';
import { selectUser } from '@/store/selectors';
import { Button } from '@/components/common/Button';
import { Modal } from './Modal';

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.PROJECTS, label: 'Projects', icon: FolderKanban },
  { href: ROUTES.TASKS, label: 'Tasks', icon: CheckSquare },
  { href: ROUTES.KANBAN, label: 'Kanban', icon: Columns3 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = memo(function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useAppSelector(selectUser);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white',
          'transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700">
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400"
          >
            <FolderKanban className="h-6 w-6" aria-hidden="true" />
            {APP_NAME}
          </Link>
          <button
            type="button"
            className="rounded p-1 lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="border-t border-slate-200 p-4 dark:border-slate-700">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        )}
      </aside>
    </>
  );
});

export const Navbar = memo(function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-slate-900 dark:text-slate-100 lg:hidden">{APP_NAME}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <span className="mr-1 hidden truncate text-sm text-slate-600 dark:text-slate-400 sm:block">
              {user.fullName}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowConfirmLogout(true)} aria-label="Logout">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <Modal
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        title="Confirm Logout"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowConfirmLogout(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to log out? You will need to sign in again to access your dashboard.
        </p>
      </Modal>
    </>
  );
});

export const Header = memo(function Header({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
  );
});
