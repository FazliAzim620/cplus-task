import type { Metadata } from 'next';
import { APP_NAME } from '@/constants';

export const metadata: Metadata = {
  title: `${APP_NAME} - Project & Task Management`,
  description: 'Enterprise project and task management dashboard',
};

export { DashboardContent as default } from '@/components/dashboard/DashboardContent';
