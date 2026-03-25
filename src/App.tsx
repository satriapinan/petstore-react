import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <Outlet />
      </main>
    </QueryClientProvider>
  );
}
