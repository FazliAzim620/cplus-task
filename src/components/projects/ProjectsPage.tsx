'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, LayoutGrid, List, Pencil, Trash2 } from 'lucide-react';
import { Header } from '@/components/common/Sidebar';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { Table, type Column } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { TableSkeleton } from '@/components/common/Loader';
import { projectSchema, type ProjectFormValues } from '@/validations/schemas';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  setPage,
} from '@/store/projectSlice';
import {
  selectProjects,
  selectProjectsLoading,
  selectProjectsError,
  selectProjectsTotal,
  selectProjectsPage,
} from '@/store/selectors';
import { useToast } from '@/providers/ToastProvider';
import { PROJECT_STATUSES, DEFAULT_PAGE_SIZE } from '@/constants';
import { formatDate } from '@/utils/format';
import type { Project } from '@/types';

export const ProjectsPage = memo(function ProjectsPage() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const isLoading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);
  const total = useAppSelector(selectProjectsTotal);
  const page = useAppSelector(selectProjectsPage);
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  const loadProjects = useCallback(() => {
    dispatch(
      fetchProjects({
        search,
        status: statusFilter || undefined,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        sort: { field: sortField, direction: sortDirection },
      })
    );
  }, [dispatch, search, statusFilter, page, sortField, sortDirection]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: 'Active' },
  });

  const openCreateModal = () => {
    setEditingProject(null);
    reset({ name: '', description: '', status: 'Active' });
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    reset({
      name: project.name,
      description: project.description,
      status: project.status,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    if (editingProject) {
      const result = await dispatch(updateProject({ id: editingProject.id, data }));
      if (updateProject.fulfilled.match(result)) {
        showToast('Project updated successfully', 'success');
        setModalOpen(false);
        loadProjects();
      }
    } else {
      const result = await dispatch(createProject(data));
      if (createProject.fulfilled.match(result)) {
        showToast('Project created successfully', 'success');
        setModalOpen(false);
        loadProjects();
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    const result = await dispatch(deleteProject(deletingProject.id));
    if (deleteProject.fulfilled.match(result)) {
      showToast('Project deleted successfully', 'success');
      setDeleteModalOpen(false);
      setDeletingProject(null);
      loadProjects();
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

  const columns: Column<Project>[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (p) => <Badge variant={p.status}>{p.status}</Badge>,
      },
      {
        key: 'createdDate',
        header: 'Created',
        sortable: true,
        render: (p) => formatDate(p.createdDate),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (p) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => openEditModal(p)} aria-label={`Edit ${p.name}`}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeletingProject(p);
                setDeleteModalOpen(true);
              }}
              aria-label={`Delete ${p.name}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Header title="Projects" description="Manage your projects and track progress" />
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1  min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              dispatch(setPage(1));
            }}
            aria-label="Search projects"
          />
        </div>
        <Select
          options={[{ value: '', label: 'All Statuses' }, ...PROJECT_STATUSES.map((s) => ({ value: s, label: s }))]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            dispatch(setPage(1));
          }}
          className="w-full sm:w-48"
          aria-label="Filter by status"
        />
        <div className="flex gap-1">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'card' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
            aria-label="Card view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={loadProjects} />}

      {isLoading ? (
        <TableSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Create your first project to get started."
          actionLabel="Create Project"
          onAction={openCreateModal}
        />
      ) : viewMode === 'table' ? (
        <Table
          columns={columns}
          data={projects}
          keyExtractor={(p) => p.id}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} hover>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <Badge variant={project.status}>{project.status}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{formatDate(project.createdDate)}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDeletingProject(project);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => dispatch(setPage(p))} />
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create Project'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>{editingProject ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Project Name" error={errors.name?.message} required {...register('name')} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
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
          <Select
            label="Status"
            options={PROJECT_STATUSES.map((s) => ({ value: s, label: s }))}
            error={errors.status?.message}
            {...register('status')}
          />
        </form>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Project"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete &quot;{deletingProject?.name}&quot;? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
});
