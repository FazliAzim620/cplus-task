import { useMemo } from 'react';
import type { RootState } from '@/types';

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export const selectProjects = (state: RootState) => state.projects.projects;
export const selectProjectsLoading = (state: RootState) => state.projects.isLoading;
export const selectProjectsError = (state: RootState) => state.projects.error;
export const selectProjectsTotal = (state: RootState) => state.projects.total;
export const selectProjectsPage = (state: RootState) => state.projects.page;

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.isLoading;
export const selectTasksSubmitting = (state: RootState) => state.tasks.isSubmitting;
export const selectTasksDeleting = (state: RootState) => state.tasks.isDeleting;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTasksTotal = (state: RootState) => state.tasks.total;
export const selectTasksPage = (state: RootState) => state.tasks.page;

export function useDashboardStats(tasks: RootState['tasks']['tasks'], projects: RootState['projects']['projects']) {
  return useMemo(() => {
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
    };
  }, [tasks, projects]);
}
