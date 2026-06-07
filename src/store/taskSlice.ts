import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { TaskState, Task, TaskFormData, FilterConfig, TaskStatus } from '@/types';
import { taskService } from '@/services/task.service';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (filters: FilterConfig = {}, { rejectWithValue }) => {
    try {
      return await taskService.getPaginated(filters);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  }
);

export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAllRaw',
  async (_, { rejectWithValue }) => {
    try {
      return await taskService.getAll();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (data: TaskFormData, { rejectWithValue }) => {
    try {
      return await taskService.create(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: string; data: Partial<TaskFormData> }, { rejectWithValue }) => {
    try {
      return await taskService.update(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }: { id: string; status: TaskStatus }, { rejectWithValue }) => {
    try {
      return await taskService.updateStatus(id, status);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update status');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setTaskPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.total = action.payload.length;
      })
      .addCase(createTask.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.tasks.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(updateTask.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTask, setTaskPage, setTasks, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
