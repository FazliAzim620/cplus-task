'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { Eye } from 'lucide-react';
import { Header } from '@/components/common/Sidebar';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { PageLoader } from '@/components/common/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { fetchAllTasks, updateTaskStatus, setTasks } from '@/store/taskSlice';
import { fetchProjects } from '@/store/projectSlice';
import { selectTasks, selectTasksLoading, selectProjects } from '@/store/selectors';
import { useToast } from '@/providers/ToastProvider';
import { TASK_STATUSES } from '@/constants';
import { formatDate } from '@/utils/format';
import type { Task, TaskStatus } from '@/types';
import { TaskDetailsModal } from '@/components/tasks/TaskDetailsModal';

interface KanbanCardProps {
  task: Task;
  isDragging?: boolean;
  onView?: (task: Task) => void;
}

const KanbanCard = memo(function KanbanCard({ task, isDragging, onView }: KanbanCardProps) {
  return (
    <Card
      padding="sm"
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 shadow-lg ring-2 ring-indigo-500' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">{task.title}</h4>
        {onView && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onView(task);
            }}
            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            aria-label={`View ${task.title}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant={task.priority}>{task.priority}</Badge>
        <span className="text-xs text-slate-400">{task.assignedUser}</span>
      </div>
      <p className="mt-2 text-xs text-slate-400">Due: {formatDate(task.dueDate)}</p>
    </Card>
  );
});

interface SortableTaskProps {
  task: Task;
  onView: (task: Task) => void;
}

const SortableTask = memo(function SortableTask({ task, onView }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
      <KanbanCard task={task} isDragging={isDragging} onView={onView} />
    </div>
  );
});

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onViewTask: (task: Task) => void;
}

const KanbanColumn = memo(function KanbanColumn({ status, tasks, onViewTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-xl bg-slate-100 p-4 dark:bg-slate-800/50 ${
        isOver ? 'ring-2 ring-indigo-500' : ''
      } h-full`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{status}</h3>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium dark:bg-slate-700">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto">
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onView={onViewTask} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
});

export const KanbanBoard = memo(function KanbanBoard() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const projects = useAppSelector(selectProjects);
  const isLoading = useAppSelector(selectTasksLoading);
  const { showToast } = useToast();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const projectNameMap = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p.name])),
    [projects]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    dispatch(fetchProjects({ pageSize: 100 }));
    dispatch(fetchAllTasks());
  }, [dispatch]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      Todo: [],
      'In Progress': [],
      Review: [],
      Completed: [],
    };
    tasks.forEach((task) => {
      grouped[task.status]?.push(task);
    });
    return grouped;
  }, [tasks]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  }, [tasks]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      let newStatus: TaskStatus = task.status;
      if (TASK_STATUSES.includes(over.id as TaskStatus)) {
        newStatus = over.id as TaskStatus;
      } else {
        const overTask = tasks.find((t) => t.id === over.id);
        if (overTask) newStatus = overTask.status;
      }

      if (newStatus === task.status) return;

      const updatedTasks = tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      dispatch(setTasks(updatedTasks));

      const result = await dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
      if (updateTaskStatus.fulfilled.match(result)) {
        showToast(`Task moved to ${newStatus}`, 'success');
      } else {
        dispatch(fetchAllTasks());
      }
    },
    [tasks, dispatch, showToast]
  );

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header title="Kanban Board" description="Drag and drop tasks between columns" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 min-h-0 gap-4 overflow-x-auto pb-4">
          {TASK_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onViewTask={setViewingTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailsModal
        task={viewingTask}
        projectName={viewingTask ? projectNameMap[viewingTask.projectId] : undefined}
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
      />
    </div>
  );
});
