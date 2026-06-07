import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kanban Board',
};

export { KanbanBoard as default } from '@/components/tasks/KanbanBoard';
