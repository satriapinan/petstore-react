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

describe('RoleGuard', () => {
  it('renders Outlet when user matches required role', async () => {
    mockUseAuth.mockReturnValue({ user: { username: 'admin' } });
    const { default: RoleGuard } = await import('./role.guard');
    render(<RoleGuard requiredRole="admin" />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('redirects to /pets when user does not match required role', async () => {
    mockUseAuth.mockReturnValue({ user: { username: 'john' } });
    const { default: RoleGuard } = await import('./role.guard');
    render(<RoleGuard requiredRole="admin" />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/pets');
  });

  it('redirects to /pets when user is null', async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const { default: RoleGuard } = await import('./role.guard');
    render(<RoleGuard requiredRole="admin" />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/pets');
  });
});
