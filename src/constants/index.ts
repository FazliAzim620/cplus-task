export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'TaskFlow';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const TOKEN_KEY = 'taskflow_token';
export const USER_KEY = 'taskflow_user';
export const THEME_KEY = 'taskflow_theme';
export const REMEMBER_KEY = 'taskflow_remember';

export const PROJECT_STATUSES = ['Active', 'In Progress', 'Completed', 'Archived'] as const;
export const TASK_STATUSES = ['Todo', 'In Progress', 'Review', 'Completed'] as const;
export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  KANBAN: '/kanban',
} as const;

export const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  Todo: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  Review: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  Critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export const KANBAN_COLUMNS = TASK_STATUSES;

export const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' },
];
