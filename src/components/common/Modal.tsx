'use client';

import { memo, type ReactNode, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Loader } from './Loader';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
  isLoading?: boolean;
  preventClose?: boolean;
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal = memo(function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  isLoading = false,
  preventClose = false,
}: ModalProps) {
  const handleClose = useCallback(() => {
    if (!preventClose && !isLoading) onClose();
  }, [preventClose, isLoading, onClose]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 w-full rounded-xl bg-white shadow-xl dark:bg-slate-900',
          sizeStyles[size]
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-slate-900/70">
            <Loader size="lg" label="Saving" />
          </div>
        )}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={preventClose || isLoading}
            aria-label="Close modal"
            className="!p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});
