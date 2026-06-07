'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { loginSchema, type LoginFormData } from '@/validations/schemas';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { loginUser, clearError } from '@/store/authSlice';
import { selectAuthLoading, selectAuthError } from '@/store/selectors';
import { useToast } from '@/providers/ToastProvider';
import { ROUTES, APP_NAME } from '@/constants';
import { useEffect } from 'react';

export const LoginForm = memo(function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      showToast('Welcome back!', 'success');
      router.push(ROUTES.DASHBOARD);
    }
  };

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Sign in to {APP_NAME}</CardTitle>
        <CardDescription>Enter your credentials to access your dashboard</CardDescription>
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
          placeholder="admin@taskflow.com"
          error={errors.email?.message}
          required
          autoComplete="email"
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          required
          autoComplete="current-password"
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              {...register('rememberMe')}
            />
            Remember me
          </label>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign In
        </Button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} className="text-indigo-600 hover:underline dark:text-indigo-400">
            Sign up
          </Link>
        </p>

        <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Demo: admin@taskflow.com / Admin@123
        </p>
      </form>
    </Card>
  );
});
