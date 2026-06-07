'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/validations/schemas';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { forgotPassword } from '@/store/authSlice';
import { selectAuthLoading, selectAuthError } from '@/store/selectors';
import { ROUTES } from '@/constants';

export const ForgotPasswordForm = memo(function ForgotPasswordForm() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await dispatch(forgotPassword(data.email));
    if (forgotPassword.fulfilled.match(result)) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <Card padding="lg">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Check your email</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            We&apos;ve sent a password reset link to your email address.
          </p>
          <Link href={ROUTES.LOGIN} className="mt-4 text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            Back to login
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {authError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400" role="alert">
            {authError}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          required
          autoComplete="email"
          {...register('email')}
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link href={ROUTES.LOGIN} className="text-indigo-600 hover:underline dark:text-indigo-400">
            Back to login
          </Link>
        </p>
      </form>
    </Card>
  );
});
