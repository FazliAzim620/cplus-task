import type { Project, Task, Activity, User } from '@/types';

export const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@taskflow.com', fullName: 'Admin User' },
  { id: '2', email: 'john@example.com', fullName: 'John Doe' },
  { id: '3', email: 'jane@example.com', fullName: 'Jane Smith' },
];

export const MOCK_PASSWORD = 'Admin@123';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern UI/UX',
    status: 'In Progress',
    createdDate: '2025-01-15',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    description: 'Build cross-platform mobile application for iOS and Android',
    status: 'Active',
    createdDate: '2025-02-01',
    updatedAt: '2025-03-05',
  },
  {
    id: 'p3',
    name: 'API Integration',
    description: 'Integrate third-party APIs for payment and analytics',
    status: 'Completed',
    createdDate: '2024-11-10',
    updatedAt: '2025-01-20',
  },
  {
    id: 'p4',
    name: 'Database Migration',
    description: 'Migrate legacy database to cloud infrastructure',
    status: 'Active',
    createdDate: '2025-02-20',
    updatedAt: '2025-03-10',
  },
  {
    id: 'p5',
    name: 'Security Audit',
    description: 'Comprehensive security review and penetration testing',
    status: 'Archived',
    createdDate: '2024-08-05',
    updatedAt: '2024-12-15',
  },
  {
    id: 'p6',
    name: 'Customer Portal',
    description: 'Self-service portal for customer account management',
    status: 'In Progress',
    createdDate: '2025-01-25',
    updatedAt: '2025-03-08',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Design homepage mockup',
    description: 'Create wireframes and high-fidelity mockups for homepage',
    priority: 'High',
    dueDate: '2025-03-15',
    assignedUser: 'John Doe',
    status: 'Completed',
    createdAt: '2025-01-20',
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Implement responsive layout',
    description: 'Build responsive grid system for all breakpoints',
    priority: 'High',
    dueDate: '2025-03-20',
    assignedUser: 'Jane Smith',
    status: 'In Progress',
    createdAt: '2025-02-01',
  },
  {
    id: 't3',
    projectId: 'p2',
    title: 'Setup React Native project',
    description: 'Initialize project with navigation and state management',
    priority: 'Medium',
    dueDate: '2025-03-10',
    assignedUser: 'John Doe',
    status: 'Completed',
    createdAt: '2025-02-05',
  },
  {
    id: 't4',
    projectId: 'p2',
    title: 'Implement authentication flow',
    description: 'OAuth and biometric authentication for mobile app',
    priority: 'Critical',
    dueDate: '2025-03-25',
    assignedUser: 'Jane Smith',
    status: 'Review',
    createdAt: '2025-02-15',
  },
  {
    id: 't5',
    projectId: 'p3',
    title: 'Stripe payment integration',
    description: 'Integrate Stripe API for payment processing',
    priority: 'High',
    dueDate: '2025-01-15',
    assignedUser: 'John Doe',
    status: 'Completed',
    createdAt: '2024-11-15',
  },
  {
    id: 't6',
    projectId: 'p4',
    title: 'Backup existing database',
    description: 'Create full backup before migration begins',
    priority: 'Critical',
    dueDate: '2025-03-12',
    assignedUser: 'Jane Smith',
    status: 'Todo',
    createdAt: '2025-02-25',
  },
  {
    id: 't7',
    projectId: 'p4',
    title: 'Setup cloud infrastructure',
    description: 'Configure AWS RDS and migration tools',
    priority: 'High',
    dueDate: '2025-03-18',
    assignedUser: 'John Doe',
    status: 'In Progress',
    createdAt: '2025-03-01',
  },
  {
    id: 't8',
    projectId: 'p6',
    title: 'User dashboard wireframes',
    description: 'Design customer dashboard with analytics widgets',
    priority: 'Medium',
    dueDate: '2025-03-22',
    assignedUser: 'Jane Smith',
    status: 'Todo',
    createdAt: '2025-02-01',
  },
  {
    id: 't9',
    projectId: 'p1',
    title: 'Accessibility audit',
    description: 'WCAG 2.1 AA compliance review and fixes',
    priority: 'Medium',
    dueDate: '2025-04-01',
    assignedUser: 'John Doe',
    status: 'Todo',
    createdAt: '2025-03-05',
  },
  {
    id: 't10',
    projectId: 'p2',
    title: 'Push notification setup',
    description: 'Configure FCM and APNs for push notifications',
    priority: 'Low',
    dueDate: '2025-04-05',
    assignedUser: 'Jane Smith',
    status: 'Todo',
    createdAt: '2025-03-01',
  },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    type: 'task',
    action: 'completed',
    description: 'Design homepage mockup was completed',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    userId: '2',
  },
  {
    id: 'a2',
    type: 'project',
    action: 'updated',
    description: 'Mobile App Development status changed to Active',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    userId: '1',
  },
  {
    id: 'a3',
    type: 'task',
    action: 'created',
    description: 'New task "Accessibility audit" was created',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    userId: '2',
  },
  {
    id: 'a4',
    type: 'task',
    action: 'assigned',
    description: 'Implement authentication flow assigned to Jane Smith',
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    userId: '1',
  },
  {
    id: 'a5',
    type: 'project',
    action: 'created',
    description: 'Customer Portal project was created',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    userId: '1',
  },
];

export const PROJECTS_STORAGE_KEY = 'taskflow_projects';
export const TASKS_STORAGE_KEY = 'taskflow_tasks';
export const ACTIVITIES_STORAGE_KEY = 'taskflow_activities';

function getFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getProjects(): Project[] {
  return getFromStorage(PROJECTS_STORAGE_KEY, INITIAL_PROJECTS);
}

export function saveProjects(projects: Project[]): void {
  saveToStorage(PROJECTS_STORAGE_KEY, projects);
}

export function getTasks(): Task[] {
  return getFromStorage(TASKS_STORAGE_KEY, INITIAL_TASKS);
}

export function saveTasks(tasks: Task[]): void {
  saveToStorage(TASKS_STORAGE_KEY, tasks);
}

export function getActivities(): Activity[] {
  return getFromStorage(ACTIVITIES_STORAGE_KEY, INITIAL_ACTIVITIES);
}

export function addActivity(activity: Activity): void {
  const activities = getActivities();
  activities.unshift(activity);
  saveToStorage(ACTIVITIES_STORAGE_KEY, activities.slice(0, 50));
}
