import ReactQueryProvider from '@/core/providers/react-query.provider';
import AppSnackbarProvider from '@/core/providers/snackbar.provider';
import LoadingPage from '@/features/loading/loading.page';
import Navbar from '@/shared/components/navbar/navbar.component';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <ReactQueryProvider>
      <AppSnackbarProvider>
        <Suspense fallback={<LoadingPage />}>
          <Navbar />
          <main>
            <Outlet />
          </main>
        </Suspense>
      </AppSnackbarProvider>
    </ReactQueryProvider>
  );
}
