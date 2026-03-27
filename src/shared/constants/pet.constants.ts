export const PET_CATEGORIES: string[] = [
  'Dogs',
  'Cats',
  'Birds',
  'Fish',
  'Reptiles',
  'Hamsters',
  'Rabbits',
  'Turtles',
];

export const PET_TAGS: string[] = [
  'Vaccinated',
  'Neutered',
  'Friendly',
  'Trained',
  'Indoor',
  'Outdoor',
  'Hypoallergenic',
  'Purebred',
];

export const PET_STATUS_OPTIONS: { label: string; value: 'available' | 'pending' | 'sold' }[] = [
  { label: 'Available', value: 'available' },
  { label: 'Pending', value: 'pending' },
  { label: 'Sold', value: 'sold' },
];

export const PET_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  SOLD: 'sold',
};
