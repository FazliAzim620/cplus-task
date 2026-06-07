'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import { Header } from '@/components/common/Sidebar';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { Table, type Column } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { TableSkeleton } from '@/components/common/Loader';
import { taskSchema, type TaskFormValues } from '@/validations/schemas';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  setTaskPage,
  clearTaskError,
} from '@/store/taskSlice';
import { fetchProjects } from '@/store/projectSlice';
import {
  selectTasks,
  selectTasksLoading,
  selectTasksSubmitting,
  selectTasksDeleting,
  selectTasksError,
  selectTasksTotal,
  selectTasksPage,
  selectProjects,
  selectProjectsLoading,
} from '@/store/selectors';
import { useToast } from '@/providers/ToastProvider';
import { TASK_STATUSES, TASK_PRIORITIES, MOCK_USERS, DEFAULT_PAGE_SIZE } from '@/constants';
import { formatDate } from '@/utils/format';
import type { Task } from '@/types';
import { TaskDetailsModal } from '@/components/tasks/TaskDetailsModal';

const TASK_FORM_ID = 'task-form';

export const TasksPage = memo(function TasksPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const projects = useAppSelector(selectProjects);
  const projectsLoading = useAppSelector(selectProjectsLoading);
  const isLoading = useAppSelector(selectTasksLoading);
  const isSubmitting = useAppSelector(selectTasksSubmitting);
  const isDeleting = useAppSelector(selectTasksDeleting);
  const error = useAppSelector(selectTasksError);
  const total = useAppSelector(selectTasksTotal);
  const page = useAppSelector(selectTasksPage);
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const projectNameMap = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p.name])),
    [projects]
  );

  const projectOptions = useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects]
  );

  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  const openViewModal = (task: Task) => {
    setViewingTask(task);
  };

  const closeViewModal = () => {
    setViewingTask(null);
  };

  const loadTasks = useCallback(() => {
    dispatch(
      fetchTasks({
        search,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        sort: { field: sortField, direction: sortDirection },
      })
    );
  }, [dispatch, search, statusFilter, priorityFilter, page, sortField, sortDirection]);

  useEffect(() => {
    dispatch(fetchProjects({ pageSize: 100 }));
  }, [dispatch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Todo',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      assignedUser: MOCK_USERS[0].name,
      projectId: '',
    },
  });

  const getDefaultFormValues = useCallback((): TaskFormValues => {
    return {
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      assignedUser: MOCK_USERS[0].name,
      status: 'Todo',
      projectId: projects[0]?.id ?? '',
    };
  }, [projects]);

  const openCreateModal = () => {
    if (projects.length === 0) {
      showToast('Please create a project before adding tasks', 'error');
      return;
    }
    dispatch(clearTaskError());
    setEditingTask(null);
    reset(getDefaultFormValues());
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    dispatch(clearTaskError());
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedUser: task.assignedUser,
      status: task.status,
      projectId: task.projectId,
    });
    setModalOpen(true);
  };

  const closeFormModal = () => {
    if (isSubmitting) return;
    setModalOpen(false);
    setEditingTask(null);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setDeletingTask(null);
  };

  const onSubmit = async (data: TaskFormValues) => {
    if (editingTask) {
      const result = await dispatch(updateTask({ id: editingTask.id, data }));
      if (updateTask.fulfilled.match(result)) {
        showToast('Task updated successfully', 'success');
        setModalOpen(false);
        setEditingTask(null);
        loadTasks();
      } else {
        showToast((result.payload as string) ?? 'Failed to update task', 'error');
      }
    } else {
      const result = await dispatch(createTask(data));
      if (createTask.fulfilled.match(result)) {
        showToast('Task created successfully', 'success');
        setModalOpen(false);
        dispatch(setTaskPage(1));
        dispatch(
          fetchTasks({
            search,
            status: statusFilter || undefined,
            priority: priorityFilter || undefined,
            page: 1,
            pageSize: DEFAULT_PAGE_SIZE,
            sort: { field: sortField, direction: sortDirection },
          })
        );
      } else {
        showToast((result.payload as string) ?? 'Failed to create task', 'error');
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    const result = await dispatch(deleteTask(deletingTask.id));
    if (deleteTask.fulfilled.match(result)) {
      showToast('Task deleted successfully', 'success');
      setDeleteModalOpen(false);
      setDeletingTask(null);
      loadTasks();
    } else {
      showToast((result.payload as string) ?? 'Failed to delete task', 'error');
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const columns: Column<Task>[] = useMemo(
    () => [
      {
        key: 'title',
        header: 'Title',
        sortable: true,
        render: (t) => (
          <button
            type="button"
            onClick={() => openViewModal(t)}
            className="text-left font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {t.title}
          </button>
        ),
      },
      {
        key: 'priority',
        header: 'Priority',
        sortable: true,
        render: (t) => <Badge variant={t.priority}>{t.priority}</Badge>,
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (t) => <Badge variant={t.status}>{t.status}</Badge>,
      },
      { key: 'assignedUser', header: 'Assigned To', sortable: true },
      {
        key: 'dueDate',
        header: 'Due Date',
        sortable: true,
        render: (t) => formatDate(t.dueDate),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (t) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openViewModal(t)}
              disabled={isSubmitting || isDeleting}
              aria-label={`View ${t.title}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditModal(t)}
              disabled={isSubmitting || isDeleting}
              aria-label={`Edit ${t.title}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeletingTask(t);
                setDeleteModalOpen(true);
              }}
              disabled={isSubmitting || isDeleting}
              aria-label={`Delete ${t.title}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    ],
    [isSubmitting, isDeleting]
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Header title="Tasks" description="Manage and track all your tasks" />
        <Button onClick={openCreateModal} disabled={projectsLoading || isSubmitting || isDeleting}>
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1  min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              dispatch(setTaskPage(1));
            }}
            aria-label="Search tasks"
          />
        </div>
        <Select
          options={[{ value: '', label: 'All Statuses' }, ...TASK_STATUSES.map((s) => ({ value: s, label: s }))]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            dispatch(setTaskPage(1));
          }}
          className="w-full sm:w-40"
          aria-label="Filter by status"
        />
        <Select
          options={[{ value: '', label: 'All Priorities' }, ...TASK_PRIORITIES.map((p) => ({ value: p, label: p }))]}
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            dispatch(setTaskPage(1));
          }}
          className="w-full sm:w-40"
          aria-label="Filter by priority"
        />
      </div>

      {error && !modalOpen && !deleteModalOpen && !viewingTask && (
        <ErrorState message={error} onRetry={loadTasks} />
      )}

      {isLoading && !isSubmitting && !isDeleting ? (
        <TableSkeleton />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Create your first task to get started."
          actionLabel="Create Task"
          onAction={openCreateModal}
        />
      ) : (
        <Table
          columns={columns}
          data={tasks}
          keyExtractor={(t) => t.id}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => dispatch(setTaskPage(p))}
          />
        </div>
      )}

      <TaskDetailsModal
        task={viewingTask}
        projectName={viewingTask ? projectNameMap[viewingTask.projectId] : undefined}
        isOpen={!!viewingTask}
        onClose={closeViewModal}
        onEdit={(task) => openEditModal(task)}
        onDelete={(task) => {
          setDeletingTask(task);
          setDeleteModalOpen(true);
        }}
      />

      <Modal
        isOpen={modalOpen}
        onClose={closeFormModal}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        size="lg"
        isLoading={isSubmitting}
        preventClose={isSubmitting}
        footer={
          <>
            <Button variant="outline" onClick={closeFormModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              form={TASK_FORM_ID}
              isLoading={isSubmitting}
            >
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </>
        }
      >
        <form
          id={TASK_FORM_ID}
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {error && modalOpen && (
            <div className="sm:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400" role="alert">
              {error}
            </div>
          )}

          <div className="sm:col-span-2">
            <Input label="Title" error={errors.title?.message} required {...register('title')} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Select
                label="Project"
                options={projectOptions}
                placeholder="Select a project"
                error={errors.projectId?.message}
                required
                {...field}
              />
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                label="Priority"
                options={TASK_PRIORITIES.map((p) => ({ value: p, label: p }))}
                error={errors.priority?.message}
                required
                {...field}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                options={TASK_STATUSES.map((s) => ({ value: s, label: s }))}
                error={errors.status?.message}
                required
                {...field}
              />
            )}
          />

          <Controller
            name="assignedUser"
            control={control}
            render={({ field }) => (
              <Select
                label="Assigned User"
                options={MOCK_USERS.map((u) => ({ value: u.name, label: u.name }))}
                error={errors.assignedUser?.message}
                required
                {...field}
              />
            )}
          />

          <Input
            label="Due Date"
            type="date"
            error={errors.dueDate?.message}
            required
            {...register('dueDate')}
          />
        </form>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Task"
        isLoading={isDeleting}
        preventClose={isDeleting}
        footer={
          <>
            <Button variant="outline" onClick={closeDeleteModal} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete &quot;{deletingTask?.title}&quot;? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
});
