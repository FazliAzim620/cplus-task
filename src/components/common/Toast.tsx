'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />,
    error: <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />,
    info: <CheckCircle className="h-5 w-5 text-blue-500" aria-hidden="true" />,
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg',
        'dark:border-slate-700 dark:bg-slate-900'
      )}
      role="alert"
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
