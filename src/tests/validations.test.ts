import { loginSchema, registerSchema, projectSchema, taskSchema } from '@/validations/schemas';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'admin@taskflow.com',
        password: 'Admin@123',
        rememberMe: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: 'Admin@123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = loginSchema.safeParse({
        email: 'admin@taskflow.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const result = registerSchema.safeParse({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Secure@123',
        confirmPassword: 'Secure@123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const result = registerSchema.safeParse({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Secure@123',
        confirmPassword: 'Different@123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects weak password', () => {
      const result = registerSchema.safeParse({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        confirmPassword: 'password',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('projectSchema', () => {
    it('validates correct project data', () => {
      const result = projectSchema.safeParse({
        name: 'Test Project',
        description: 'A test project description',
        status: 'Active',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const result = projectSchema.safeParse({
        name: '',
        description: 'Description',
        status: 'Active',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('taskSchema', () => {
    it('validates correct task data', () => {
      const result = taskSchema.safeParse({
        title: 'Test Task',
        description: 'Task description',
        priority: 'High',
        dueDate: '2025-12-31',
        assignedUser: 'John Doe',
        status: 'Todo',
        projectId: 'p1',
      });
      expect(result.success).toBe(true);
    });
  });
});
