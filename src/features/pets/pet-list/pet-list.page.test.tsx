import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PetListPage from './pet-list.page';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: '?status=available' }),
}));

vi.mock('@/core/services/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/core/services/hooks/usePet', () => ({
  usePet: vi.fn(),
}));

vi.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: vi.fn() }),
}));

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-icon={icon} />,
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

vi.mock('@/shared/components/confirm-modal/confirm-modal.component', () => ({
  default: ({
    isOpen,
    onConfirm,
    onCancel,
    title,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
  }) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <span>{title}</span>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

vi.mock('@/shared/components/pagination/pagination.component', () => ({
  default: () => <div data-testid="pagination" />,
}));

import { useAuth } from '@/core/services/hooks/useAuth';
import { usePet } from '@/core/services/hooks/usePet';

const mockUseAuth = vi.mocked(useAuth);
const mockUsePet = vi.mocked(usePet);

type MockPet = {
  id: number;
  name: string;
  status: string;
  category: { name: string };
  photoUrls: string[];
  tags: unknown[];
};
type MockPetListReturn = {
  pets: MockPet[];
  petsLoading: boolean;
  petsError: Error | null;
  deletePet: ReturnType<typeof vi.fn>;
};

const makePetListMock = (overrides?: Partial<MockPetListReturn>): MockPetListReturn => ({
  pets: [],
  petsLoading: false,
  petsError: null,
  deletePet: vi.fn(),
  ...overrides,
});

const mockPetReturn = (overrides?: Partial<MockPetListReturn>) => {
  mockUsePet.mockReturnValue(makePetListMock(overrides) as unknown as ReturnType<typeof usePet>);
};

const samplePets: MockPet[] = [
  {
    id: 1,
    name: 'Buddy',
    status: 'available',
    category: { name: 'Dogs' },
    photoUrls: [],
    tags: [],
  },
  {
    id: 2,
    name: 'Whiskers',
    status: 'available',
    category: { name: 'Cats' },
    photoUrls: [],
    tags: [],
  },
];

describe('PetListPage - non-admin user', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { username: 'john' } } as unknown as ReturnType<
      typeof useAuth
    >);
    mockPetReturn({ pets: samplePets });
  });

  it('renders page title', () => {
    render(<PetListPage />);
    expect(screen.getByText('Pets')).toBeTruthy();
  });

  it('renders pet names', () => {
    render(<PetListPage />);
    expect(screen.getByText('Buddy')).toBeTruthy();
    expect(screen.getByText('Whiskers')).toBeTruthy();
  });

  it('does not render Add Pet button for non-admin', () => {
    render(<PetListPage />);
    expect(screen.queryByText('Add Pet')).toBeNull();
  });

  it('does not render status tabs for non-admin', () => {
    render(<PetListPage />);
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('shows companion-finding description for non-admin', () => {
    render(<PetListPage />);
    expect(screen.getByText('Find your perfect companion.')).toBeTruthy();
  });
});

describe('PetListPage - admin user', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { username: 'admin' } } as unknown as ReturnType<
      typeof useAuth
    >);
    mockPetReturn({ pets: samplePets });
  });

  it('renders Add Pet button for admin', () => {
    render(<PetListPage />);
    expect(screen.getByText('Add Pet')).toBeTruthy();
  });

  it('renders status tabs for admin', () => {
    render(<PetListPage />);
    expect(screen.getByRole('tablist')).toBeTruthy();
  });

  it('renders back to dashboard button', () => {
    render(<PetListPage />);
    expect(screen.getByLabelText('Back to dashboard')).toBeTruthy();
  });

  it('navigates to dashboard on back button click', () => {
    render(<PetListPage />);
    fireEvent.click(screen.getByLabelText('Back to dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to Add Pet on button click', () => {
    render(<PetListPage />);
    fireEvent.click(screen.getByText('Add Pet'));
    expect(mockNavigate).toHaveBeenCalledWith('/pets/create');
  });

  it('opens confirm modal when delete is clicked', () => {
    render(<PetListPage />);
    const deleteButtons = screen.getAllByLabelText('Delete pet');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByTestId('confirm-modal')).toBeTruthy();
  });

  it('closes confirm modal on cancel', () => {
    render(<PetListPage />);
    const deleteButtons = screen.getAllByLabelText('Delete pet');
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('confirm-modal')).toBeNull();
  });

  it('calls deletePet on confirm', async () => {
    const deletePet = vi.fn().mockResolvedValue({});
    mockPetReturn({ pets: samplePets, deletePet });

    render(<PetListPage />);
    const deleteButtons = screen.getAllByLabelText('Delete pet');
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(deletePet).toHaveBeenCalledWith(1);
    });
  });
});

describe('PetListPage - states', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { username: 'admin' } } as unknown as ReturnType<
      typeof useAuth
    >);
  });

  it('renders loading state', () => {
    mockPetReturn({ petsLoading: true });
    render(<PetListPage />);
    expect(screen.getByTestId('spinner')).toBeTruthy();
    expect(screen.getByText('Loading pets...')).toBeTruthy();
  });

  it('renders error state', () => {
    mockPetReturn({ petsError: new Error('fail') });
    render(<PetListPage />);
    expect(screen.getByText('Failed to load pets.')).toBeTruthy();
  });

  it('renders empty state', () => {
    mockPetReturn();
    render(<PetListPage />);
    expect(screen.getByText('No pets found for this status.')).toBeTruthy();
  });
});
