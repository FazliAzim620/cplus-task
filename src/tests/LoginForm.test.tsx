import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import projectReducer from '@/store/projectSlice';
import taskReducer from '@/store/taskSlice';
import { LoginForm } from '@/components/forms/LoginForm';
import { ToastProvider } from '@/providers/ToastProvider';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/services/auth.service', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    getStoredAuth: jest.fn(),
    isTokenValid: jest.fn(),
  },
}));

function renderWithProviders(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { auth: authReducer, projects: projectReducer, tasks: taskReducer },
  });
  return render(
    <Provider store={store}>
      <ToastProvider>{ui}</ToastProvider>
    </Provider>
  );
}

describe('LoginForm', () => {
  it('renders login form fields', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/^password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
