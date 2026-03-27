import { lazy } from 'react';

import AuthGuard from '@/core/guards/auth.guard';
import RoleGuard from '@/core/guards/role.guard';

/* eslint-disable react-refresh/only-export-components */
const PetListPage = lazy(() => import('@/features/pets/pet-list/pet-list.page'));
const DashboardPage = lazy(() => import('@/features/dashboard/dashboard.page'));
const PetFormPage = lazy(() => import('@/features/pets/pet-form/pet-form.page'));

export const authRoutes = {
  element: <AuthGuard />,
  children: [
    {
      path: 'pets',
      element: <PetListPage />,
    },
    {
      element: <RoleGuard requiredRole="admin" />,
      children: [
        {
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: 'pets/create',
          element: <PetFormPage />,
        },
        {
          path: 'pets/update/:id',
          element: <PetFormPage />,
        },
      ],
    },
  ],
};
