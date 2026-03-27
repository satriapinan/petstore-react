import GuestGuard from '@/core/guards/guest.guard';
import { lazy } from 'react';

/* eslint-disable react-refresh/only-export-components */
const LoginPage = lazy(() => import('@/features/auth/login/login.page'));
const RegisterPage = lazy(() => import('@/features/auth/register/register.page'));

export const guestRoutes = {
  element: <GuestGuard />,
  children: [
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
  ],
};
