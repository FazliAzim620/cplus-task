'use client';

import { memo, forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, id, required, ...props }, ref) => {
      const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

      return (
        <div className="w-full">
          {label && (
            <label
              htmlFor={inputId}
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {label}
              {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
            </label>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
              'placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
              'dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            required={required}
            {...props}
          />
          {hint && !error && (
            <p id={`${inputId}-hint`} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {hint}
            </p>
          )}
          {error && (
            <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );
    }
  )
);

Input.displayName = 'Input';
