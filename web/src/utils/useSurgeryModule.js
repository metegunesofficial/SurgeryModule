import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSurgeryPlanningStore } from '@/stores/surgeryPlanning';

/**
 * Hooks for the Surgery (Ameliyat) module.
 * These return stable placeholder data with React Query so real data sources can be wired later
 * without refactoring consuming components. All queries are configured to be effectively read-only
 * with infinite stale time to avoid unnecessary refetches (rate-limit friendly).
 */

const SURGERY_STATIC_DATA = {
  todayProgram: [
    {
      title: 'İmplant Cerrahisi',
      doctor: 'Dr. Atilla',
      patient: 'Ahmet Y.',
      timeRange: '09:00 - 11:30 (150 dk)',
      status: 'in-progress',
    },
    {
      title: 'Diş Çekimi',
      doctor: 'Dr. Mehmet',
      patient: 'Zeynep K.',
      timeRange: '14:00 - 14:45 (45 dk)',
      status: 'upcoming',
    },
    {
      title: 'Kanal Tedavisi',
      doctor: 'Dr. Ayşe',
      patient: 'Emre D.',
      timeRange: '16:00 - 17:30 (90 dk)',
      status: 'scheduled',
    },
  ],
  operatingRooms: [
    { name: 'Ameliyathane 1', status: 'Kullanımda', readyAt: '11:30' },
    { name: 'Ameliyathane 2', status: 'Sterilizasyon', readyAt: '13:00' },
    { name: 'Ameliyathane 3', status: 'Müsait', readyAt: 'Hazır' },
  ],
  preOpChecklist: [
    { text: 'Hasta kimlik kontrolü', state: 'done' },
    { text: 'Anestezi onayı alındı', state: 'done' },
    { text: 'Cerrahi alan işaretlendi', state: 'done' },
    { text: 'Sterilizasyon kontrolü', state: 'pending' },
    { text: 'Ameliyathane hazırlığı', state: 'todo' },
  ],
  resourceUtilization: {
    operatingRoomUtilization: 78,
    equipmentAvailability: 85,
    personnel: 'Tam kadro',
  },
  weeklySchedule: [
    [
      { time: '09:00', type: 'implant', doctor: 'Dr. Atilla' },
      { time: '14:00', type: 'extraction', doctor: 'Dr. Mehmet' },
    ],
    [{ time: '10:00', type: 'root-canal', doctor: 'Dr. Ayşe' }],
    [
      { time: '09:30', type: 'implant', doctor: 'Dr. Atilla' },
      { time: '15:00', type: 'cleaning', doctor: 'Dr. Mehmet' },
    ],
    [],
    [
      { time: '11:00', type: 'extraction', doctor: 'Dr. Ayşe' },
      { time: '16:00', type: 'root-canal', doctor: 'Dr. Atilla' },
    ],
    [{ time: '09:00', type: 'implant', doctor: 'Dr. Mehmet' }],
    [],
  ],
  upcomingSurgeries: [
    {
      patient: { name: 'Ahmet Yılmaz', id: '12345' },
      type: 'İmplant Cerrahisi',
      doctor: 'Dr. Atilla',
      date: '11 Ağu, 09:00',
      duration: '150 dakika',
      room: 'Oda 1',
      status: 'Devam Ediyor',
      action: 'more',
    },
    {
      patient: { name: 'Zeynep Kaya', id: '12346' },
      type: 'Diş Çekimi',
      doctor: 'Dr. Mehmet',
      date: '11 Ağu, 14:00',
      duration: '45 dakika',
      room: 'Oda 2',
      status: 'Bekliyor',
      action: 'edit',
    },
    {
      patient: { name: 'Emre Demir', id: '12347' },
      type: 'Kanal Tedavisi',
      doctor: 'Dr. Ayşe',
      date: '11 Ağu, 16:00',
      duration: '90 dakika',
      room: 'Oda 3',
      status: 'Planlandı',
      action: 'edit',
    },
  ],
};

export function useTodayProgram() {
  return useQuery({
    queryKey: ['surgery', 'todayProgram'],
    queryFn: async () => SURGERY_STATIC_DATA.todayProgram,
    initialData: SURGERY_STATIC_DATA.todayProgram,
    staleTime: Infinity,
  });
}

export function useOperatingRoomsStatus() {
  return useQuery({
    queryKey: ['surgery', 'operatingRooms'],
    queryFn: async () => SURGERY_STATIC_DATA.operatingRooms,
    initialData: SURGERY_STATIC_DATA.operatingRooms,
    staleTime: Infinity,
  });
}

export function usePreOpChecklist() {
  return useQuery({
    queryKey: ['surgery', 'preOpChecklist'],
    queryFn: async () => SURGERY_STATIC_DATA.preOpChecklist,
    initialData: SURGERY_STATIC_DATA.preOpChecklist,
    staleTime: Infinity,
  });
}

export function useResourceUtilization() {
  return useQuery({
    queryKey: ['surgery', 'resourceUtilization'],
    queryFn: async () => SURGERY_STATIC_DATA.resourceUtilization,
    initialData: SURGERY_STATIC_DATA.resourceUtilization,
    staleTime: Infinity,
  });
}

export function useWeeklySchedule() {
  const days = useMemo(
    () => ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    []
  );
  const scheduleQuery = useQuery({
    queryKey: ['surgery', 'weeklySchedule'],
    queryFn: async () => SURGERY_STATIC_DATA.weeklySchedule,
    initialData: SURGERY_STATIC_DATA.weeklySchedule,
    staleTime: Infinity,
  });
  return { days, ...scheduleQuery };
}

export function useUpcomingSurgeries() {
  return useQuery({
    queryKey: ['surgery', 'upcoming'],
    queryFn: async () => SURGERY_STATIC_DATA.upcomingSurgeries,
    initialData: SURGERY_STATIC_DATA.upcomingSurgeries,
    staleTime: Infinity,
  });
}

export function useConflictSummary() {
  const checkConflicts = useSurgeryPlanningStore((s) => s.checkConflicts);
  return useQuery({
    queryKey: ['surgery', 'conflicts'],
    queryFn: async () => checkConflicts(),
    initialData: { count: 0, details: [] },
    staleTime: Infinity,
  });
}

export default function useSurgeryModule() {
  return {
    useTodayProgram,
    useOperatingRoomsStatus,
    usePreOpChecklist,
    useResourceUtilization,
    useWeeklySchedule,
    useUpcomingSurgeries,
    useConflictSummary,
  };
}


