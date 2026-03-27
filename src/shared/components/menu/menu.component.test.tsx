import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Menu from './menu.component';

describe('Menu', () => {
  it('renders trigger', () => {
    render(<Menu trigger={<span>Open</span>} />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('does not show children by default', () => {
    render(
      <Menu trigger={<span>Open</span>}>
        <span>Item</span>
      </Menu>,
    );
    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('shows children after trigger click', () => {
    render(
      <Menu trigger={<span>Open</span>}>
        <span>Item</span>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('hides children after second trigger click', () => {
    render(
      <Menu trigger={<span>Open</span>}>
        <span>Item</span>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    render(
      <Menu trigger={<span>Open</span>}>
        <span>Item</span>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('closes when clicking outside', () => {
    render(
      <div>
        <Menu trigger={<span>Open</span>}>
          <span>Item</span>
        </Menu>
        <span>Outside</span>
      </div>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Item')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Outside'));
    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });
});
