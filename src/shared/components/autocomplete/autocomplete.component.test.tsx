import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Autocomplete from './autocomplete.component';

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid="icon">{icon}</span>,
}));

const options = ['Apple', 'Banana', 'Cherry'];

describe('Autocomplete', () => {
  it('renders label', () => {
    render(<Autocomplete label="Fruit" value="" onChange={vi.fn()} options={options} />);
    expect(screen.getByText('Fruit')).toBeInTheDocument();
  });

  it('renders input with value', () => {
    render(<Autocomplete label="Fruit" value="Apple" onChange={vi.fn()} options={options} />);
    expect(screen.getByDisplayValue('Apple')).toBeInTheDocument();
  });

  it('shows dropdown on focus', () => {
    render(<Autocomplete label="Fruit" value="" onChange={vi.fn()} options={options} />);
    fireEvent.focus(screen.getByRole('textbox'));
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('filters options based on input value', () => {
    render(<Autocomplete label="Fruit" value="an" onChange={vi.fn()} options={options} />);
    fireEvent.focus(screen.getByRole('textbox'));
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('calls onChange when option selected', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Fruit" value="" onChange={onChange} options={options} />);
    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.mouseDown(screen.getByText('Apple'));
    expect(onChange).toHaveBeenCalledWith('Apple');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<Autocomplete label="Fruit" value="" onChange={onChange} options={options} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'B' } });
    expect(onChange).toHaveBeenCalledWith('B');
  });
});
