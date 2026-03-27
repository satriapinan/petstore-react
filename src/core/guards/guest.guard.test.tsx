import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
  Outlet: () => <div data-testid="outlet" />,
}));

const mockUseAuth = vi.fn();

vi.mock('@/core/services/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('GuestGuard', () => {
  it('renders Outlet when not authenticated', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });
    const { default: GuestGuard } = await import('./guest.guard');
    render(<GuestGuard />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('redirects to /dashboard when authenticated as admin', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { username: 'admin' } });
    const { default: GuestGuard } = await import('./guest.guard');
    render(<GuestGuard />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/dashboard');
  });

  it('redirects to /pets when authenticated as non-admin', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { username: 'john' } });
    const { default: GuestGuard } = await import('./guest.guard');
    render(<GuestGuard />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/pets');
  });
});
