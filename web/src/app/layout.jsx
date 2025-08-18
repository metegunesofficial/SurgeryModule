import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { runDevSeed } from '@/lib/devSeed';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({children}) {
  if (typeof window !== 'undefined') {
    // Run once on client mount in development to populate abundant mock data
    try { runDevSeed(); } catch {}
  }
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ paddingLeft: 'var(--app-container-padding-x)', paddingRight: 'var(--app-container-padding-x)', paddingTop: 'var(--app-container-padding-y)', paddingBottom: 'var(--app-container-padding-y)', maxWidth: 'var(--app-container-max-width)', marginLeft: 'auto', marginRight: 'auto' }}>
        {children}
      </div>
    </QueryClientProvider>
  );
}