import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  status: z.enum(['Active', 'In Progress', 'Completed', 'Archived']),
  createdDate: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  dueDate: z.string().min(1, 'Due date is required'),
  assignedUser: z.string().min(1, 'Assigned user is required'),
  status: z.enum(['Todo', 'In Progress', 'Review', 'Completed']),
  projectId: z.string().min(1, 'Project is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProjectFormValues = z.infer<typeof projectSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;
