import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './login.page';

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

type MockAuthReturn = { login: ReturnType<typeof vi.fn>; isLoginPending: boolean };

const mockReturn = (overrides: MockAuthReturn) => {
  mockUseAuth.mockReturnValue(overrides as unknown as ReturnType<typeof useAuth>);
};

const TEST_USER = 'admin';
const TEST_CREDENTIAL = 'abc12345';

const submitForm = (container: HTMLElement) => {
  const form = container.querySelector('form');
  if (form) fireEvent.submit(form);
};

describe('LoginPage', () => {
  it('renders welcome title', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    render(<LoginPage />);
    expect(screen.getByText('Welcome Back!')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    render(<LoginPage />);
    expect(screen.getByText('Please enter your details')).toBeTruthy();
  });

  it('renders username and password fields', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    render(<LoginPage />);
    expect(screen.getByLabelText('Username')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
  });

  it('renders Sign In button', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    render(<LoginPage />);
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  it('renders register link', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    render(<LoginPage />);
    expect(screen.getByText('Sign up')).toBeTruthy();
  });

  it('disables submit button when fields are empty', () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    render(<LoginPage />);
    expect(screen.getByText('Sign In')).toBeDisabled();
  });

  it('enables submit button when fields are filled', async () => {
    mockReturn({ login: vi.fn(), isLoginPending: false });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: TEST_USER } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: TEST_CREDENTIAL } });

    await waitFor(() => {
      expect(screen.getByText('Sign In')).not.toBeDisabled();
    });
  });

  it('calls login on valid form submit', async () => {
    const login = vi.fn().mockResolvedValue({});
    mockReturn({ login, isLoginPending: false });
    const { container } = render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: TEST_USER } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: TEST_CREDENTIAL } });
    submitForm(container);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ username: TEST_USER, password: TEST_CREDENTIAL });
    });
  });

  it('shows error message on login failure', async () => {
    const login = vi.fn().mockRejectedValue(new Error('unauthorized'));
    mockReturn({ login, isLoginPending: false });
    const { container } = render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongcred' } });
    submitForm(container);

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeTruthy();
    });
  });

  it('disables Sign In button while login is pending', () => {
    mockReturn({ login: vi.fn(), isLoginPending: true });
    render(<LoginPage />);
    expect(screen.getByText('Sign In')).toBeDisabled();
  });
});
