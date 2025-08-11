"use client";
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, createContext, useContext } from 'react';
import { ToastProvider, Toaster } from '@/components/ui/Toast';

type SidebarState = { open: boolean; setOpen: (value: boolean) => void };
const SidebarContext = createContext<SidebarState | undefined>(undefined);
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('SidebarContext not found');
  return ctx;
}

export default function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={client}>
        <ToastProvider>
          <SidebarContext.Provider value={{ open: sidebarOpen, setOpen: setSidebarOpen }}>
            {children}
            <Toaster />
          </SidebarContext.Provider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}


