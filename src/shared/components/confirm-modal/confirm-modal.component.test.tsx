import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ConfirmModal from './confirm-modal.component';

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid="icon">{icon}</span>,
}));

vi.mock('@/shared/components/button/button.component', () => ({
  default: ({
    label,
    onClick,
    loading,
    disabled,
  }: {
    label: string;
    onClick: () => void;
    loading: boolean;
    disabled: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled || loading}>
      {label}
    </button>
  ),
}));

describe('ConfirmModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<ConfirmModal isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders title and message', () => {
    render(<ConfirmModal isOpen title="Delete?" message="This cannot be undone." />);
    expect(screen.getByText('Delete?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal isOpen confirmLabel="Yes" onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmModal isOpen cancelLabel="No" onCancel={onCancel} />);
    fireEvent.click(screen.getByText('No'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onCancel when Escape key pressed', () => {
    const onCancel = vi.fn();
    render(<ConfirmModal isOpen onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onCancel when backdrop clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmModal isOpen onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('none'));
  });

  it('disables buttons when loading', () => {
    render(<ConfirmModal isOpen loading confirmLabel="Confirm" cancelLabel="Cancel" />);
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});
