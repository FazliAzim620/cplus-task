'use client';

import { memo, forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = memo(
  forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, id, required, ...props }, ref) => {
      const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

      return (
        <div className="w-full">
          {label && (
            <label
              htmlFor={selectId}
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {label}
              {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
            </label>
          )}
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
              'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
              'dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            required={required}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && (
            <p id={`${selectId}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );
    }
  )
);

Select.displayName = 'Select';
