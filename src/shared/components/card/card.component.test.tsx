import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Card from './card.component';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <p>Hello</p>
      </Card>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies default padding', () => {
    const { container } = render(<Card />);
    const card = container.querySelector('.card');
    expect((card as HTMLElement).style.padding).toBe('36px');
  });

  it('applies custom padding', () => {
    const { container } = render(<Card padding="16px" />);
    const card = container.querySelector('.card');
    expect((card as HTMLElement).style.padding).toBe('16px');
  });

  it('applies custom background', () => {
    const { container } = render(<Card background="red" />);
    const card = container.querySelector('.card');
    expect((card as HTMLElement).style.background).toBe('red');
  });

  it('applies custom minWidth', () => {
    const { container } = render(<Card minWidth="300px" />);
    const card = container.querySelector('.card');
    expect((card as HTMLElement).style.minWidth).toBe('300px');
  });

  it('applies customStyle', () => {
    const { container } = render(<Card customStyle={{ color: 'blue' }} />);
    const card = container.querySelector('.card');
    expect((card as HTMLElement).style.color).toBe('blue');
  });
});
