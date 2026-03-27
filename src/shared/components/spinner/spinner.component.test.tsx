import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Spinner from './spinner.component';

describe('Spinner', () => {
  it('renders spinner element', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    const { container } = render(<Spinner size={40} />);
    const spinner = container.querySelector('.spinner');
    expect((spinner as HTMLElement).style.width).toBe('40px');
    expect((spinner as HTMLElement).style.height).toBe('40px');
  });

  it('applies custom color', () => {
    const { container } = render(<Spinner color="red" />);
    const spinner = container.querySelector('.spinner');
    expect((spinner as HTMLElement).style.borderTopColor).toBe('red');
  });

  it('uses default size and color', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.spinner');
    expect((spinner as HTMLElement).style.width).toBe('20px');
    expect((spinner as HTMLElement).style.height).toBe('20px');
  });
});
