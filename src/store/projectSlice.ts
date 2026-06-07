import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ProjectState, Project, ProjectFormData, FilterConfig } from '@/types';
import { projectService } from '@/services/project.service';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (filters: FilterConfig = {}, { rejectWithValue }) => {
    try {
      return await projectService.getPaginated(filters);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (data: ProjectFormData, { rejectWithValue }) => {
    try {
      return await projectService.create(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }: { id: string; data: Partial<ProjectFormData> }, { rejectWithValue }) => {
    try {
      return await projectService.update(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete project');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearProjectError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.projects[index] = action.payload;
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setSelectedProject, setPage, clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
