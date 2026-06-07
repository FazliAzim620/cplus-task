'use client';

import { memo, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { registerSchema, type RegisterFormData } from '@/validations/schemas';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { registerUser, clearError } from '@/store/authSlice';
import { selectAuthLoading, selectAuthError } from '@/store/selectors';
import { useToast } from '@/providers/ToastProvider';
import { ROUTES, APP_NAME } from '@/constants';

export const RegisterForm = memo(function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      showToast('Account created successfully!', 'success');
      router.push(ROUTES.DASHBOARD);
    }
  };

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Join {APP_NAME} to manage your projects and tasks</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {authError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400" role="alert">
            {authError}
          </div>
        )}

        <Input
          label="Full Name"
          placeholder="John Doe"
          error={errors.fullName?.message}
          required
          autoComplete="name"
          {...register('fullName')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          required
          autoComplete="email"
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          hint="Min 8 chars, uppercase, lowercase, number, special char"
          required
          autoComplete="new-password"
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          required
          autoComplete="new-password"
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          Create Account
        </Button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="text-indigo-600 hover:underline dark:text-indigo-400">
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
});
