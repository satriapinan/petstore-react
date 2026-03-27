import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RegisterPage from './register.page';

vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@/core/services/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/shared/components/button/button.component', () => ({
  default: ({
    label,
    type,
    loading,
    disabled,
  }: {
    label: string;
    type?: string;
    loading?: boolean;
    disabled?: boolean;
  }) => (
    <button type={type as 'button' | 'submit' | 'reset'} disabled={disabled ?? loading}>
      {label}
    </button>
  ),
}));

vi.mock('@/shared/components/card/card.component', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/components/textfield/textfield.component', () => ({
  default: ({
    label,
    value,
    onChange,
    type,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
  }) => (
    <input
      aria-label={label}
      type={type ?? 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

import { useAuth } from '@/core/services/hooks/useAuth';

const mockUseAuth = vi.mocked(useAuth);

type MockAuthReturn = { register: ReturnType<typeof vi.fn>; isRegisterPending: boolean };

const mockReturn = (overrides: MockAuthReturn) => {
  mockUseAuth.mockReturnValue(overrides as unknown as ReturnType<typeof useAuth>);
};

const TEST_CREDENTIAL = 'abc12345';

const submitForm = (container: HTMLElement) => {
  const form = container.querySelector('form');
  if (form) fireEvent.submit(form);
};

describe('RegisterPage', () => {
  it('renders Get Started title', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    render(<RegisterPage />);
    expect(screen.getByText('Get Started!')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    render(<RegisterPage />);
    expect(screen.getByText('Create your account')).toBeTruthy();
  });

  it('renders username, password, and confirm password fields', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    render(<RegisterPage />);
    expect(screen.getByLabelText('Username')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByLabelText('Confirm Password')).toBeTruthy();
  });

  it('renders Sign Up button', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    render(<RegisterPage />);
    expect(screen.getByText('Sign Up')).toBeTruthy();
  });

  it('renders sign in link', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    render(<RegisterPage />);
    expect(screen.getByText('Sign in')).toBeTruthy();
  });

  it('disables Sign Up button when fields are empty', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    render(<RegisterPage />);
    expect(screen.getByText('Sign Up')).toBeDisabled();
  });

  it('shows error when passwords do not match', async () => {
    mockReturn({ register: vi.fn(), isRegisterPending: false });
    const { container } = render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: TEST_CREDENTIAL } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different' } });
    submitForm(container);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('calls register with correct values on valid submit', async () => {
    const register = vi.fn().mockResolvedValue({});
    mockReturn({ register, isRegisterPending: false });
    const { container } = render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: TEST_CREDENTIAL } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: TEST_CREDENTIAL },
    });
    submitForm(container);

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({ username: 'newuser', password: TEST_CREDENTIAL });
    });
  });

  it('shows error message on registration failure', async () => {
    const register = vi.fn().mockRejectedValue(new Error('fail'));
    mockReturn({ register, isRegisterPending: false });
    const { container } = render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: TEST_CREDENTIAL } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: TEST_CREDENTIAL },
    });
    submitForm(container);

    await waitFor(() => {
      expect(screen.getByText('Registration failed. Please try again.')).toBeTruthy();
    });
  });

  it('disables Sign Up button while registration is pending', () => {
    mockReturn({ register: vi.fn(), isRegisterPending: true });
    render(<RegisterPage />);
    expect(screen.getByText('Sign Up')).toBeDisabled();
  });
});
