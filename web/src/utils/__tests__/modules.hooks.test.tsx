import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTodayProgram, useWeeklySchedule, useConflictSummary } from '../useSurgeryModule.js';
import { useActiveCycles, useTraceabilityInfo, useKitStatuses } from '../useSterilizationModule.js';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: 0,
      },
    },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('Surgery and Sterilization hooks', () => {
  it('useTodayProgram returns stable placeholder data', async () => {
    const { result } = renderHook(() => useTodayProgram(), { wrapper: createWrapper() });
    expect(result.current.data?.length).toBe(3);
    expect(result.current.data?.[0].title).toMatch(/İmplant/i);
  });

  it('useWeeklySchedule returns 7 days with schedules', async () => {
    const { result } = renderHook(() => useWeeklySchedule(), { wrapper: createWrapper() });
    expect(result.current.data?.length).toBe(7);
    expect(result.current.days).toEqual(['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']);
  });

  it('useActiveCycles returns active cycles', async () => {
    const { result } = renderHook(() => useActiveCycles(), { wrapper: createWrapper() });
    expect(result.current.data?.length).toBeGreaterThanOrEqual(1);
    expect(result.current.data?.[0].status).toBeDefined();
  });

  it('useTraceabilityInfo returns chain-of-custody text', async () => {
    const { result } = renderHook(() => useTraceabilityInfo(), { wrapper: createWrapper() });
    expect(result.current.data).toMatch(/QR\s*>\s*Yükleme/i);
  });

  it('useConflictSummary returns a structure with count', async () => {
    const { result } = renderHook(() => useConflictSummary(), { wrapper: createWrapper() });
    expect(result.current.data?.count).toBeDefined();
  });

  it('useKitStatuses returns kits array from store', async () => {
    const { result } = renderHook(() => useKitStatuses(), { wrapper: createWrapper() });
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});


