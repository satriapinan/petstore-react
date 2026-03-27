import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MenuItem from './menu-item.component';

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid="icon">{icon}</span>,
}));

describe('MenuItem', () => {
  it('renders label', () => {
    render(<MenuItem label="Settings" />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<MenuItem label="Logout" icon="mdi:logout" />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not render icon when not provided', () => {
    render(<MenuItem label="Logout" />);
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('applies danger class when danger prop is true', () => {
    render(<MenuItem label="Delete" danger />);
    expect(screen.getByRole('button')).toHaveClass('danger');
  });

  it('does not apply danger class by default', () => {
    render(<MenuItem label="Edit" />);
    expect(screen.getByRole('button')).not.toHaveClass('danger');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<MenuItem label="Click Me" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
