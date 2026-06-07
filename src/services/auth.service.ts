import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  DashboardStats,
  Activity,
} from '@/types';
import { TOKEN_KEY, USER_KEY, REMEMBER_KEY } from '@/constants';
import { delay, generateId } from '@/utils/format';
import {
  getStorageItem,
  setStorageItem,
  setStorageString,
  removeStorageItem,
} from '@/utils/storage';
import { MOCK_USERS, MOCK_PASSWORD } from '@/data/mockData';

function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })
  );
  const signature = btoa(`${userId}-mock-signature`);
  return `${header}.${payload}.${signature}`;
}

function persistAuth(user: User, token: string, rememberMe = false): void {
  setStorageString(TOKEN_KEY, token);
  setStorageItem(USER_KEY, user);
  setStorageItem(REMEMBER_KEY, rememberMe);
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800);

    const user = MOCK_USERS.find((u) => u.email === credentials.email);
    if (!user || credentials.password !== MOCK_PASSWORD) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user.id);
    persistAuth(user, token, credentials.rememberMe);
    return { user, token };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(1000);

    const existing = MOCK_USERS.find((u) => u.email === data.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const user: User = {
      id: generateId(),
      email: data.email,
      fullName: data.fullName,
    };

    MOCK_USERS.push(user);
    const token = generateToken(user.id);
    persistAuth(user, token, true);
    return { user, token };
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    await delay(800);

    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      throw new Error('No account found with this email');
    }

    return { message: 'Password reset link sent to your email' };
  },

  logout(): void {
    removeStorageItem(TOKEN_KEY);
    removeStorageItem(USER_KEY);
    removeStorageItem(REMEMBER_KEY);
  },

  getStoredAuth(): AuthResponse | null {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    const user = getStorageItem<User>(USER_KEY);
    if (!token || !user) return null;
    return { user, token };
  },

  isTokenValid(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1])) as { exp: number };
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  },
};

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    await delay(600);
    const { projectService } = await import('./project.service');
    const { taskService } = await import('./task.service');
    const projects = await projectService.getAll();
    const tasks = await taskService.getAll();
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;

    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
    };
  },

  async getActivities(): Promise<Activity[]> {
    await delay(400);
    const { getActivities } = await import('@/data/mockData');
    return getActivities();
  },
};
