'use client';

import { memo, type ReactNode } from 'react';
import {
  Calendar,
  User,
  FolderKanban,
  Clock,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatDate, formatDateTime } from '@/utils/format';
import type { Task } from '@/types';

interface DetailRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

const DetailRow = memo(function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400" aria-hidden="true">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">{value}</div>
      </div>
    </div>
  );
});

export interface TaskDetailsModalProps {
  task: Task | null;
  projectName?: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export const TaskDetailsModal = memo(function TaskDetailsModal({
  task,
  projectName,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailsModalProps) {
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
            <Button
              variant="danger"
              onClick={() => {
                onDelete(task);
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          {onEdit && (
            <Button
              onClick={() => {
                onEdit(task);
                onClose();
              }}
            >
              <Pencil className="h-4 w-4" />
              Edit Task
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={task.status}>{task.status}</Badge>
            <Badge variant={task.priority}>{task.priority}</Badge>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Description
          </p>
          <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
            {task.description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </div>
    </Modal>
  );
});
