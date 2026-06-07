import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tasks',
};

export { TasksPage as default } from '@/components/tasks/TasksPage';
