import type { Task, TaskFormData, FilterConfig, PaginatedResponse, TaskStatus } from '@/types';
import { delay, generateId } from '@/utils/format';
import { filterBySearch, paginateItems, sortByField } from '@/utils/sort';
import { getTasks, saveTasks, addActivity } from '@/data/mockData';

export const taskService = {
  async getAll(): Promise<Task[]> {
    await delay(500);
    return getTasks();
  },

  async getPaginated(filters: FilterConfig = {}): Promise<PaginatedResponse<Task>> {
    await delay(500);
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;

    let items = getTasks();

    if (filters.search) {
      items = filterBySearch(items, filters.search, [
        'title',
        'description',
        'assignedUser',
        'status',
        'priority',
      ]);
    }

    if (filters.status) {
      items = items.filter((t) => t.status === filters.status);
    }

    if (filters.priority) {
      items = items.filter((t) => t.priority === filters.priority);
    }

    items = sortByField(items, filters.sort ?? { field: 'dueDate', direction: 'asc' });

    const total = items.length;
    const data = paginateItems(items, page, pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async getById(id: string): Promise<Task | null> {
    await delay(300);
    return getTasks().find((t) => t.id === id) ?? null;
  },

  async create(data: TaskFormData): Promise<Task> {
    await delay(600);
    const task: Task = {
      id: generateId(),
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
      assignedUser: data.assignedUser,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tasks = getTasks();
    tasks.unshift(task);
    saveTasks(tasks);

    addActivity({
      id: generateId(),
      type: 'task',
      action: 'created',
      description: `Task "${task.title}" was created`,
      timestamp: new Date().toISOString(),
      userId: '1',
    });

    return task;
  },

  async update(id: string, data: Partial<TaskFormData>): Promise<Task> {
    await delay(600);
    const tasks = getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');

    const updated: Task = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    tasks[index] = updated;
    saveTasks(tasks);

    addActivity({
      id: generateId(),
      type: 'task',
      action: 'updated',
      description: `Task "${updated.title}" was updated`,
      timestamp: new Date().toISOString(),
      userId: '1',
    });

    return updated;
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.update(id, { status });
  },

  async delete(id: string): Promise<void> {
    await delay(500);
    const tasks = getTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');

    saveTasks(tasks.filter((t) => t.id !== id));

    addActivity({
      id: generateId(),
      type: 'task',
      action: 'deleted',
      description: `Task "${task.title}" was deleted`,
      timestamp: new Date().toISOString(),
      userId: '1',
    });
  },
};
