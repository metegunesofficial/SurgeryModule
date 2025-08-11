import type { SurgeryCreateInput } from './schemas';
import { surgeryStore as memoryStore, type SurgeryItem } from './store';
import { createClient } from '@supabase/supabase-js';

function isSupabaseEnabled(): boolean {
  return process.env.USE_SUPABASE === '1' &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, service);
}

export async function listSurgeries(): Promise<{ items: SurgeryItem[]; count: number }> {
  if (!isSupabaseEnabled()) return memoryStore.list();
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('surgeries')
      .select('*')
      .order('scheduled_start', { ascending: true });
    if (error) throw error;
    type Row = {
      id: string;
      created_at: string;
      patient_id: string | null;
      patient_name: string;
      surgeon_id: string | null;
      room_id: string | null;
      procedure_type: string;
      scheduled_start: string;
      estimated_duration: number;
      notes: string | null;
      status: string | null;
    };
    const items: SurgeryItem[] = (data as Row[] | null ?? []).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      patientId: row.patient_id ?? undefined,
      patientName: row.patient_name,
      surgeonId: row.surgeon_id ?? undefined,
      roomId: row.room_id ?? undefined,
      procedureType: row.procedure_type,
      scheduledStart: new Date(row.scheduled_start),
      estimatedDuration: row.estimated_duration,
      notes: row.notes ?? undefined,
      status: (row.status ?? undefined) as SurgeryItem['status'],
    }));
    return { items, count: items.length };
  } catch {
    return memoryStore.list();
  }
}

export async function createSurgery(input: SurgeryCreateInput): Promise<SurgeryItem> {
  if (!isSupabaseEnabled()) return memoryStore.create(input);
  try {
    const supabase = getServerSupabase();
    const payload = {
      patient_id: input.patientId ?? null,
      patient_name: input.patientName,
      surgeon_id: input.surgeonId ?? null,
      room_id: input.roomId ?? null,
      procedure_type: input.procedureType,
      scheduled_start: input.scheduledStart,
      estimated_duration: input.estimatedDuration,
      notes: input.notes ?? null,
      status: input.status ?? 'scheduled',
    };
    const { data, error } = await supabase.from('surgeries').insert(payload).select('*').single();
    if (error) throw error;
    return {
      id: data.id,
      createdAt: data.created_at,
      patientId: data.patient_id ?? undefined,
      patientName: data.patient_name,
      surgeonId: data.surgeon_id ?? undefined,
      roomId: data.room_id ?? undefined,
      procedureType: data.procedure_type,
      scheduledStart: new Date(data.scheduled_start),
      estimatedDuration: data.estimated_duration,
      notes: data.notes ?? undefined,
      status: (data.status ?? undefined) as SurgeryItem['status'],
    };
  } catch {
    return memoryStore.create(input);
  }
}

export async function updateSurgery(id: string, input: Partial<SurgeryCreateInput>): Promise<SurgeryItem | undefined> {
  if (!isSupabaseEnabled()) return memoryStore.update(id, input);
  try {
    const supabase = getServerSupabase();
    const payload: Record<string, unknown> = {
      patient_id: input.patientId ?? undefined,
      patient_name: input.patientName ?? undefined,
      surgeon_id: input.surgeonId ?? undefined,
      room_id: input.roomId ?? undefined,
      procedure_type: input.procedureType ?? undefined,
      scheduled_start: input.scheduledStart ?? undefined,
      estimated_duration: input.estimatedDuration ?? undefined,
      notes: input.notes ?? undefined,
      status: input.status ?? undefined,
    };
    const { data, error } = await supabase.from('surgeries').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return {
      id: data.id,
      createdAt: data.created_at,
      patientId: data.patient_id ?? undefined,
      patientName: data.patient_name,
      surgeonId: data.surgeon_id ?? undefined,
      roomId: data.room_id ?? undefined,
      procedureType: data.procedure_type,
      scheduledStart: new Date(data.scheduled_start),
      estimatedDuration: data.estimated_duration,
      notes: data.notes ?? undefined,
      status: (data.status ?? undefined) as SurgeryItem['status'],
    };
  } catch {
    return memoryStore.update(id, input);
  }
}

export async function removeSurgery(id: string): Promise<boolean> {
  if (!isSupabaseEnabled()) return memoryStore.remove(id);
  try {
    const supabase = getServerSupabase();
    const { error } = await supabase.from('surgeries').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch {
    return memoryStore.remove(id);
  }
}


