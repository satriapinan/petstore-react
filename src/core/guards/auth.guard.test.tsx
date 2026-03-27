import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
  Outlet: () => <div data-testid="outlet" />,
}));

const mockUseAuth = vi.fn();

vi.mock('@core/services/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('AuthGuard', () => {
  it('renders Outlet when authenticated', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    const { default: AuthGuard } = await import('./auth.guard');
    render(<AuthGuard />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    const { default: AuthGuard } = await import('./auth.guard');
    render(<AuthGuard />);
    const navigate = screen.getByTestId('navigate');
    expect(navigate).toBeInTheDocument();
    expect(navigate).toHaveAttribute('data-to', '/login');
  });
});
