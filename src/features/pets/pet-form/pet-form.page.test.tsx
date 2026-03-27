import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PetFormPage from './pet-form.page';

const mockNavigate = vi.fn();
const mockUseParams = vi.fn(() => ({}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

vi.mock('@/core/services/hooks/usePet', () => ({
  usePet: vi.fn(),
}));

vi.mock('@/shared/components/button/button.component', () => ({
  default: ({
    label,
    onClick,
    type,
    loading,
  }: {
    label: string;
    onClick?: () => void;
    type?: string;
    loading?: boolean;
  }) => (
    <button type={type as 'button' | 'submit' | 'reset'} onClick={onClick} disabled={loading}>
      {label}
    </button>
  ),
}));

vi.mock('@/shared/components/textfield/textfield.component', () => ({
  default: ({
    label,
    value,
    onChange,
    type,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
  }) => (
    <input
      aria-label={label}
      type={type ?? 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('@/shared/components/autocomplete/autocomplete.component', () => ({
  default: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => <input aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} />,
}));

vi.mock('@/shared/constants/pet.constants', () => ({
  PET_CATEGORIES: ['Dogs', 'Cats'],
  PET_TAGS: ['Vaccinated', 'Neutered'],
  PET_STATUS_OPTIONS: [
    { value: 'available', label: 'Available' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
  ],
}));

import { usePet } from '@/core/services/hooks/usePet';

const mockUsePet = vi.mocked(usePet);

type MockUsePetReturn = {
  pet: {
    id: number;
    name: string;
    category: { name: string };
    tags: { name: string }[];
    status: string;
  } | null;
  petLoading: boolean;
  createPet: ReturnType<typeof vi.fn>;
  updatePet: ReturnType<typeof vi.fn>;
  isCreating: boolean;
  isUpdating: boolean;
};

const makeDefaultMock = (overrides?: Partial<MockUsePetReturn>): MockUsePetReturn => ({
  pet: null,
  petLoading: false,
  createPet: vi.fn().mockResolvedValue({}),
  updatePet: vi.fn().mockResolvedValue({}),
  isCreating: false,
  isUpdating: false,
  ...overrides,
});

const mockReturn = (overrides?: Partial<MockUsePetReturn>) => {
  mockUsePet.mockReturnValue(makeDefaultMock(overrides) as unknown as ReturnType<typeof usePet>);
};

const submitForm = (container: HTMLElement) => {
  const form = container.querySelector('form');
  if (form) fireEvent.submit(form);
};

describe('PetFormPage - Add Mode', () => {
  it('renders Add New Pet title', () => {
    mockReturn();
    render(<PetFormPage />);
    expect(screen.getByText('Add New Pet')).toBeTruthy();
  });

  it('renders form fields', () => {
    mockReturn();
    render(<PetFormPage />);
    expect(screen.getByLabelText('Name')).toBeTruthy();
    expect(screen.getByLabelText('Category')).toBeTruthy();
    expect(screen.getByLabelText('Tag')).toBeTruthy();
  });

  it('renders status options', () => {
    mockReturn();
    render(<PetFormPage />);
    expect(screen.getByText('Available')).toBeTruthy();
    expect(screen.getByText('Pending')).toBeTruthy();
    expect(screen.getByText('Sold')).toBeTruthy();
  });

  it('renders Cancel and Add Pet buttons', () => {
    mockReturn();
    render(<PetFormPage />);
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Add Pet')).toBeTruthy();
  });

  it('navigates to /dashboard on cancel', () => {
    mockReturn();
    render(<PetFormPage />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('calls createPet on valid submit', async () => {
    const createPet = vi.fn().mockResolvedValue({});
    mockReturn({ createPet });
    const { container } = render(<PetFormPage />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Buddy' } });
    submitForm(container);

    await waitFor(() => {
      expect(createPet).toHaveBeenCalled();
    });
  });

  it('shows submit error on createPet failure', async () => {
    const createPet = vi.fn().mockRejectedValue(new Error('fail'));
    mockReturn({ createPet });
    const { container } = render(<PetFormPage />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Buddy' } });
    submitForm(container);

    await waitFor(() => {
      expect(screen.getByText('Failed to add pet. Please try again.')).toBeTruthy();
    });
  });
});

describe('PetFormPage - Edit Mode', () => {
  it('renders Update Pet heading when id is present', () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockReturn({
      pet: {
        id: 1,
        name: 'Max',
        category: { name: 'Dogs' },
        tags: [{ name: 'Vaccinated' }],
        status: 'available',
      },
      petLoading: false,
    });

    render(<PetFormPage />);
    expect(screen.getByRole('heading', { name: 'Update Pet' })).toBeTruthy();
  });
});
