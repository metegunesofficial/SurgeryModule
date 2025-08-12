import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

/**
 * Hooks for the Sterilization module.
 * Returns stable placeholder data via React Query with infinite stale time (rate-limit friendly).
 */

const STERILIZATION_STATIC_DATA = {
  activeCycles: [
    {
      id: '002',
      device: 'Autoclave #1',
      startedAt: '10:30',
      progressPct: 75,
      timeLeft: '15 dk',
      temperature: '134°C',
      pressure: '2.1 bar',
      status: 'Devam Ediyor',
    },
    {
      id: '003',
      device: 'Autoclave #2',
      eta: '11:45',
      progressPct: 25,
      items: '18 Adet Cerrahi Alet',
      status: 'Hazırlık',
    },
  ],
  deviceStatus: [
    { name: 'Autoclave #1', lastService: '5 Ağu 2025', state: 'Aktif', successRate: '99.8%' },
    { name: 'Autoclave #2', lastService: '3 Ağu 2025', state: 'Beklemede', successRate: '99.5%' },
    { name: 'Ultrasonic #1', lastService: '1 Ağu 2025', state: 'Bakım Gerekli', planned: '12 Ağu' },
  ],
  qcTests: [
    { name: 'Bowie-Dick Testi', state: 'Bugün' },
    { name: 'Spor Testi', state: 'Dün' },
    { name: 'Steam Penetration', state: 'Planlı' },
    { name: 'Leak Test', state: 'Hata' },
  ],
  instrumentSets: [
    { name: 'İmplant Seti', state: 'Tam' },
    { name: 'Endodonti Seti', state: 'Eksik' },
  ],
  traceabilityInfo: 'QR > Yükleme > Döngü > Boşaltma > Depolama > Kullanım > Dezenfeksiyon',
  qaMetrics: {
    biologicalIndicators: '%100 geçiş',
    chemicalIndicators: 'Tip 5/6 tamam',
    cycleSuccess: '%99.6',
  },
  recentCycles: [
    { id: '#002', device: 'Autoclave #1', start: '10:30', duration: '45 dk', materials: '24 Cerrahi Alet', status: 'Devam Ediyor', operator: 'Hemşire Ayşe' },
    { id: '#001', device: 'Autoclave #2', start: '08:15', duration: '50 dk', materials: '18 Cerrahi Alet', status: 'Tamamlandı', operator: 'Teknisyen Mehmet' },
    { id: '#000', device: 'Autoclave #1', start: 'Dün 16:30', duration: '45 dk', materials: '32 Cerrahi Alet', status: 'Tamamlandı', operator: 'Hemşire Zeynep' },
  ],
};

export function useActiveCycles() {
  return useQuery({
    queryKey: ['sterilization', 'activeCycles'],
    queryFn: async () => STERILIZATION_STATIC_DATA.activeCycles,
    initialData: STERILIZATION_STATIC_DATA.activeCycles,
    staleTime: Infinity,
  });
}

export function useDeviceStatus() {
  return useQuery({
    queryKey: ['sterilization', 'deviceStatus'],
    queryFn: async () => STERILIZATION_STATIC_DATA.deviceStatus,
    initialData: STERILIZATION_STATIC_DATA.deviceStatus,
    staleTime: Infinity,
  });
}

export function useQualityControlTests() {
  return useQuery({
    queryKey: ['sterilization', 'qcTests'],
    queryFn: async () => STERILIZATION_STATIC_DATA.qcTests,
    initialData: STERILIZATION_STATIC_DATA.qcTests,
    staleTime: Infinity,
  });
}

export function useInstrumentSets() {
  return useQuery({
    queryKey: ['sterilization', 'instrumentSets'],
    queryFn: async () => STERILIZATION_STATIC_DATA.instrumentSets,
    initialData: STERILIZATION_STATIC_DATA.instrumentSets,
    staleTime: Infinity,
  });
}

export function useTraceabilityInfo() {
  return useQuery({
    queryKey: ['sterilization', 'traceability'],
    queryFn: async () => STERILIZATION_STATIC_DATA.traceabilityInfo,
    initialData: STERILIZATION_STATIC_DATA.traceabilityInfo,
    staleTime: Infinity,
  });
}

export function useQualityAssuranceMetrics() {
  return useQuery({
    queryKey: ['sterilization', 'qaMetrics'],
    queryFn: async () => STERILIZATION_STATIC_DATA.qaMetrics,
    initialData: STERILIZATION_STATIC_DATA.qaMetrics,
    staleTime: Infinity,
  });
}

export function useRecentCycles() {
  return useQuery({
    queryKey: ['sterilization', 'recentCycles'],
    queryFn: async () => STERILIZATION_STATIC_DATA.recentCycles,
    initialData: STERILIZATION_STATIC_DATA.recentCycles,
    staleTime: Infinity,
  });
}

export default function useSterilizationModule() {
  return {
    useActiveCycles,
    useDeviceStatus,
    useQualityControlTests,
    useInstrumentSets,
    useTraceabilityInfo,
    useQualityAssuranceMetrics,
    useRecentCycles,
  };
}


