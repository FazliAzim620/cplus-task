import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser, logout } from '@/store/authSlice';
import projectReducer, { createProject, deleteProject } from '@/store/projectSlice';
import taskReducer, { createTask, updateTaskStatus } from '@/store/taskSlice';

jest.mock('@/services/auth.service', () => ({
  authService: {
    login: jest.fn().mockResolvedValue({
      user: { id: '1', email: 'admin@taskflow.com', fullName: 'Admin' },
      token: 'mock-token',
    }),
    logout: jest.fn(),
    getStoredAuth: jest.fn().mockReturnValue(null),
    isTokenValid: jest.fn().mockReturnValue(true),
  },
}));

jest.mock('@/services/project.service', () => ({
  projectService: {
    getPaginated: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }),
    create: jest.fn().mockResolvedValue({
      id: 'new-p1',
      name: 'New Project',
      description: 'Desc',
      status: 'Active',
      createdDate: '2025-01-01',
    }),
    delete: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@/services/task.service', () => ({
  taskService: {
    getPaginated: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }),
    create: jest.fn().mockResolvedValue({
      id: 'new-t1',
      projectId: 'p1',
      title: 'New Task',
      description: 'Desc',
      priority: 'Medium',
      dueDate: '2025-12-31',
      assignedUser: 'John',
      status: 'Todo',
      createdAt: '2025-01-01',
    }),
    updateStatus: jest.fn().mockImplementation((id: string, status: string) =>
      Promise.resolve({
        id,
        projectId: 'p1',
        title: 'Task',
        description: 'Desc',
        priority: 'High',
        dueDate: '2025-12-31',
        assignedUser: 'John',
        status,
        createdAt: '2025-01-01',
      })
    ),
  },
}));

function createTestStore() {
  return configureStore({
    reducer: { auth: authReducer, projects: projectReducer, tasks: taskReducer },
  });
}

describe('Redux Store', () => {
  describe('authSlice', () => {
    it('handles login success', async () => {
      const store = createTestStore();
      await store.dispatch(loginUser({ email: 'admin@taskflow.com', password: 'Admin@123' }));
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe('admin@taskflow.com');
    });

    it('handles logout', () => {
      const store = createTestStore();
      store.dispatch(logout());
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.user).toBeNull();
    });
  });

  describe('projectSlice', () => {
    it('handles project creation', async () => {
      const store = createTestStore();
      await store.dispatch(
        createProject({ name: 'New Project', description: 'Desc', status: 'Active' })
      );
      expect(store.getState().projects.projects).toHaveLength(1);
      expect(store.getState().projects.projects[0].name).toBe('New Project');
    });

    it('handles project deletion', async () => {
      const store = createTestStore();
      await store.dispatch(
        createProject({ name: 'To Delete', description: 'Desc', status: 'Active' })
      );
      const id = store.getState().projects.projects[0].id;
      await store.dispatch(deleteProject(id));
      expect(store.getState().projects.projects).toHaveLength(0);
    });
  });

  describe('taskSlice', () => {
    it('handles task creation', async () => {
      const store = createTestStore();
      await store.dispatch(
        createTask({
          title: 'New Task',
          description: 'Desc',
          priority: 'Medium',
          dueDate: '2025-12-31',
          assignedUser: 'John',
          status: 'Todo',
          projectId: 'p1',
        })
      );
      expect(store.getState().tasks.tasks).toHaveLength(1);
    });

    it('handles task status update', async () => {
      const store = createTestStore();
      await store.dispatch(
        createTask({
          title: 'Task',
          description: 'Desc',
          priority: 'High',
          dueDate: '2025-12-31',
          assignedUser: 'John',
          status: 'Todo',
          projectId: 'p1',
        })
      );
      const taskId = store.getState().tasks.tasks[0].id;
      await store.dispatch(updateTaskStatus({ id: taskId, status: 'In Progress' }));
      expect(store.getState().tasks.tasks[0]?.status).toBe('In Progress');
    });
  });
});
