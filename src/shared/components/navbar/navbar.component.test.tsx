import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid="icon">{icon}</span>,
}));

const mockUseAuth = vi.fn();

vi.mock('@/core/services/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Navbar', () => {
  it('renders logo', async () => {
    mockUseAuth.mockReturnValue({ user: { username: 'testuser' }, logout: vi.fn() });
    const { default: Navbar } = await import('./navbar.component');
    render(<Navbar />);
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  it('renders username', async () => {
    mockUseAuth.mockReturnValue({ user: { username: 'testuser' }, logout: vi.fn() });
    const { default: Navbar } = await import('./navbar.component');
    render(<Navbar />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('renders avatar with first letter of username', async () => {
    mockUseAuth.mockReturnValue({ user: { username: 'testuser' }, logout: vi.fn() });
    const { default: Navbar } = await import('./navbar.component');
    render(<Navbar />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('does not render profile when user is null', async () => {
    mockUseAuth.mockReturnValue({ user: null, logout: vi.fn() });
    const { default: Navbar } = await import('./navbar.component');
    render(<Navbar />);
    expect(screen.queryByText('testuser')).not.toBeInTheDocument();
  });
});
