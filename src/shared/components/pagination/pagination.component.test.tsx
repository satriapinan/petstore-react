import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Pagination from './pagination.component';

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid="icon">{icon}</span>,
}));

describe('Pagination', () => {
  it('renders page buttons', () => {
    render(<Pagination totalItems={30} pageSize={10} currentPage={1} />);
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
  });

  it('returns null when totalPages <= 1', () => {
    const { container } = render(<Pagination totalItems={5} pageSize={10} currentPage={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onPageChange when page button clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination totalItems={30} pageSize={10} currentPage={1} onPageChange={onPageChange} />,
    );
    fireEvent.click(screen.getByLabelText('Page 2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(<Pagination totalItems={30} pageSize={10} currentPage={1} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination totalItems={30} pageSize={10} currentPage={3} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls onPageChange with previous page on prev click', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination totalItems={30} pageSize={10} currentPage={2} onPageChange={onPageChange} />,
    );
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with next page on next click', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination totalItems={30} pageSize={10} currentPage={1} onPageChange={onPageChange} />,
    );
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
