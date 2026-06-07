'use client';

import { memo } from 'react';
import {
  Calendar,
  User,
  FolderKanban,
  Clock,
  AlignLeft,
} from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatDate, formatDateTime } from '@/utils/format';
import type { Task } from '@/types';

export interface TaskDetailModalProps {
  task: Task | null;
  projectName?: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const DetailRow = memo(function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex gap-3 py-3">
      <div className="mt-0.5 text-slate-400" aria-hidden="true">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </dt>
        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{value}</dd>
      </div>
    </div>
  );
});

export const TaskDetailModal = memo(function TaskDetailModal({
  task,
  projectName,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailModalProps) {
  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onDelete && (
            <Button variant="danger" onClick={() => onDelete(task)}>
              Delete
            </Button>
          )}
          {onEdit && (
            <Button onClick={() => onEdit(task)}>
              Edit Task
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-2">
        <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={task.status}>{task.status}</Badge>
            <Badge variant={task.priority}>{task.priority}</Badge>
          </div>
        </div>

        <dl className="divide-y divide-slate-100 dark:divide-slate-800">
          <DetailRow
            icon={<AlignLeft className="h-4 w-4" />}
            label="Description"
            value={
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                {task.description}
              </p>
            }
          />
          <DetailRow
            icon={<FolderKanban className="h-4 w-4" />}
            label="Project"
            value={projectName ?? 'Unknown project'}
          />
          <DetailRow
            icon={<User className="h-4 w-4" />}
            label="Assigned To"
            value={task.assignedUser}
          />
          <DetailRow
            icon={<Calendar className="h-4 w-4" />}
            label="Due Date"
            value={formatDate(task.dueDate)}
          />
          <DetailRow
            icon={<Clock className="h-4 w-4" />}
            label="Created"
            value={formatDateTime(task.createdAt)}
          />
          {task.updatedAt && (
            <DetailRow
              icon={<Clock className="h-4 w-4" />}
              label="Last Updated"
              value={formatDateTime(task.updatedAt)}
            />
          )}
        </dl>
      </div>
    </Modal>
  );
});
