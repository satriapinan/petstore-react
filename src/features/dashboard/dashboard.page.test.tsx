import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DashboardPage from './dashboard.page';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/core/services/hooks/usePet', () => ({
  usePet: vi.fn(),
}));

vi.mock('@/shared/components/button/button.component', () => ({
  default: ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

vi.mock('@/shared/components/card/card.component', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/components/spinner/spinner.component', () => ({
  default: () => <div data-testid="spinner" />,
}));

import { usePet } from '@/core/services/hooks/usePet';

const mockUsePet = vi.mocked(usePet);

type MockPetReturn = {
  inventory: { available: number; pending: number; sold: number } | null;
  inventoryLoading: boolean;
  inventoryError: Error | null;
};

const mockReturn = (overrides: MockPetReturn) => {
  mockUsePet.mockReturnValue(overrides as unknown as ReturnType<typeof usePet>);
};

describe('DashboardPage', () => {
  it('renders greeting text', () => {
    mockReturn({
      inventory: { available: 5, pending: 2, sold: 10 },
      inventoryLoading: false,
      inventoryError: null,
    });
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Good to see you again 👋')).toBeTruthy();
  });

  it('renders loading state', () => {
    mockReturn({ inventory: null, inventoryLoading: true, inventoryError: null });
    render(<DashboardPage />);
    expect(screen.getByTestId('spinner')).toBeTruthy();
    expect(screen.getByText('Loading inventory...')).toBeTruthy();
  });

  it('renders error state', () => {
    mockReturn({ inventory: null, inventoryLoading: false, inventoryError: new Error('error') });
    render(<DashboardPage />);
    expect(screen.getByText('Failed to load inventory data.')).toBeTruthy();
  });

  it('renders inventory cards with correct values', () => {
    mockReturn({
      inventory: { available: 5, pending: 2, sold: 10 },
      inventoryLoading: false,
      inventoryError: null,
    });
    render(<DashboardPage />);
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('renders Add Pet button', () => {
    mockReturn({
      inventory: { available: 0, pending: 0, sold: 0 },
      inventoryLoading: false,
      inventoryError: null,
    });
    render(<DashboardPage />);
    expect(screen.getByText('Add Pet')).toBeTruthy();
  });

  it('navigates to /pets/create when Add Pet is clicked', () => {
    mockReturn({
      inventory: { available: 0, pending: 0, sold: 0 },
      inventoryLoading: false,
      inventoryError: null,
    });
    render(<DashboardPage />);
    fireEvent.click(screen.getByText('Add Pet'));
    expect(mockNavigate).toHaveBeenCalledWith('/pets/create');
  });

  it('navigates to pets with status when card is clicked', () => {
    mockReturn({
      inventory: { available: 3, pending: 1, sold: 7 },
      inventoryLoading: false,
      inventoryError: null,
    });
    render(<DashboardPage />);
    const availableCard = screen.getByText('Available').closest('button');
    fireEvent.click(availableCard!);
    expect(mockNavigate).toHaveBeenCalledWith('/pets?status=available');
  });

  it('shows 0 when inventory value is missing', () => {
    mockReturn({ inventory: null, inventoryLoading: false, inventoryError: null });
    render(<DashboardPage />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(3);
  });
});
