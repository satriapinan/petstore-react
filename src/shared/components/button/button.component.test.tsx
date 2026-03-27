import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Button from './button.component';

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid="icon">{icon}</span>,
}));

vi.mock('@/shared/components/spinner/spinner.component', () => ({
  default: () => <div data-testid="spinner" />,
}));

describe('Button', () => {
  it('renders label', () => {
    render(<Button label="Click Me" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders spinner when loading', () => {
    render(<Button label="Save" loading />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Submit" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading', () => {
    render(<Button label="Submit" loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders icon when icon prop provided', () => {
    render(<Button label="Add" icon="mdi:plus" />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies fullWidth class', () => {
    render(<Button label="Full" fullWidth />);
    expect(screen.getByRole('button')).toHaveClass('btn--full');
  });

  it('applies variant class', () => {
    render(<Button label="Outline" variant="outline" />);
    expect(screen.getByRole('button')).toHaveClass('btn--outline');
  });

  it('applies color class', () => {
    render(<Button label="Danger" color="danger" />);
    expect(screen.getByRole('button')).toHaveClass('btn--color-danger');
  });
});
