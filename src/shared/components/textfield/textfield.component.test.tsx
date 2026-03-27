import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Textfield from './textfield.component';

describe('Textfield', () => {
  it('renders label', () => {
    render(<Textfield label="Username" value="" onChange={vi.fn()} />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders input with value', () => {
    render(<Textfield label="Username" value="john" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('john')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = vi.fn();
    render(<Textfield label="Username" value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new' } });
    expect(onChange).toHaveBeenCalledWith('new');
  });

  it('renders password type input', () => {
    render(<Textfield label="Password" value="" onChange={vi.fn()} type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('renders placeholder', () => {
    render(<Textfield label="Name" value="" onChange={vi.fn()} placeholder="Enter name" />);
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });
});
