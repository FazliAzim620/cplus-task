import type { Project, ProjectFormData, FilterConfig, PaginatedResponse } from '@/types';
import { delay, generateId } from '@/utils/format';
import { filterBySearch, paginateItems, sortByField } from '@/utils/sort';
import { getProjects, saveProjects, addActivity } from '@/data/mockData';

export const projectService = {
  async getAll(): Promise<Project[]> {
    await delay(500);
    return getProjects();
  },

  async getPaginated(filters: FilterConfig = {}): Promise<PaginatedResponse<Project>> {
    await delay(500);
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;

    let items = getProjects();

    if (filters.search) {
      items = filterBySearch(items, filters.search, ['name', 'description', 'status']);
    }

    if (filters.status) {
      items = items.filter((p) => p.status === filters.status);
    }

    items = sortByField(items, filters.sort ?? { field: 'createdDate', direction: 'desc' });

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

  async getById(id: string): Promise<Project | null> {
    await delay(300);
    return getProjects().find((p) => p.id === id) ?? null;
  },

  async create(data: ProjectFormData): Promise<Project> {
    await delay(600);
    const project: Project = {
      id: generateId(),
      name: data.name,
      description: data.description,
      status: data.status,
      createdDate: data.createdDate ?? new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };

    const projects = getProjects();
    projects.unshift(project);
    saveProjects(projects);

    addActivity({
      id: generateId(),
      type: 'project',
      action: 'created',
      description: `Project "${project.name}" was created`,
      timestamp: new Date().toISOString(),
      userId: '1',
    });

    return project;
  },

  async update(id: string, data: Partial<ProjectFormData>): Promise<Project> {
    await delay(600);
    const projects = getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');

    const updated: Project = {
      ...projects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    projects[index] = updated;
    saveProjects(projects);

    addActivity({
      id: generateId(),
      type: 'project',
      action: 'updated',
      description: `Project "${updated.name}" was updated`,
      timestamp: new Date().toISOString(),
      userId: '1',
    });

    return updated;
  },

  async delete(id: string): Promise<void> {
    await delay(500);
    const projects = getProjects();
    const project = projects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');

    saveProjects(projects.filter((p) => p.id !== id));

    addActivity({
      id: generateId(),
      type: 'project',
      action: 'deleted',
      description: `Project "${project.name}" was deleted`,
      timestamp: new Date().toISOString(),
      userId: '1',
    });
  },
};
