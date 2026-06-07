export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
}

export type ProjectStatus = 'Active' | 'In Progress' | 'Completed' | 'Archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdDate: string;
  updatedAt?: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  assignedUser: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Activity {
  id: string;
  type: 'project' | 'task';
  action: string;
  description: string;
  timestamp: string;
  userId: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  createdDate?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  assignedUser: string;
  status: TaskStatus;
  projectId: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  pageSize?: number;
  sort?: SortConfig;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

export interface RootState {
  auth: AuthState;
  projects: ProjectState;
  tasks: TaskState;
}
