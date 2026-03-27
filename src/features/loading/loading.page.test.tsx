import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoadingPage from './loading.page';

vi.mock('@/shared/components/spinner/spinner.component', () => ({
  default: ({ size }: { size: number }) => <div data-testid="spinner" data-size={size} />,
}));

describe('LoadingPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingPage />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders the loading page wrapper with correct class', () => {
    const { container } = render(<LoadingPage />);
    expect(container.querySelector('.loading-page')).toBeTruthy();
  });

  it('renders the Spinner component', () => {
    render(<LoadingPage />);
    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('renders Spinner with size 40', () => {
    render(<LoadingPage />);
    const spinner = screen.getByTestId('spinner');
    expect((spinner as HTMLElement).dataset.size).toBe('40');
  });
});
