import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from '@/App';
import { authRoutes } from '@/core/routes/auth.routes';
import { guestRoutes } from './guest.routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },

      guestRoutes,
      authRoutes,

      {
        path: '*',
        element: <Navigate to="/login" replace />,
      },
    ],
  },
]);
