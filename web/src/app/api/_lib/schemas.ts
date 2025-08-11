import { z } from 'zod';

export const surgeryCreateSchema = z.object({
  patientId: z.string().min(1, 'patientId is required').optional(),
  patientName: z.string().min(1, 'patientName is required'),
  surgeonId: z.string().min(1).optional(),
  roomId: z.string().min(1).optional(),
  procedureType: z.string().min(1, 'procedureType is required'),
  scheduledStart: z.coerce.date(),
  estimatedDuration: z.coerce.number().int().min(1).max(24 * 60),
  notes: z.string().optional(),
  status: z.enum(['scheduled','preparing','in_progress','completed','cancelled']).optional(),
});

export type SurgeryCreateInput = z.infer<typeof surgeryCreateSchema>;

export const roomItemSchema = z.object({ id: z.string(), name: z.string() });
export const roomsResponseSchema = z.object({ items: z.array(roomItemSchema) });

export const displayItemSchema = z.object({
  id: z.string(),
  roomId: z.string().nullable(),
  patient: z.string(),
  procedure: z.string(),
  status: z.string(),
  start: z.string(),
  remainingMinutes: z.number(),
  updatedAt: z.string(),
});
export const displayResponseSchema = z.object({ items: z.array(displayItemSchema) });

export const surgeryItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  patientId: z.string().optional(),
  patientName: z.string(),
  surgeonId: z.string().optional(),
  roomId: z.string().optional(),
  procedureType: z.string(),
  scheduledStart: z.union([z.string(), z.date()]),
  estimatedDuration: z.number().int(),
  notes: z.string().optional(),
  status: z.enum(['scheduled','preparing','in_progress','completed','cancelled']).optional(),
});
export const surgeriesResponseSchema = z.object({
  items: z.array(surgeryItemSchema),
  count: z.number().int(),
});

export const reportItemSchema = z.object({ code: z.string(), title: z.string(), status: z.string() });
export const reportResponseSchema = z.object({
  report: z.enum(['sks','jci']),
  generatedAt: z.string(),
  items: z.array(reportItemSchema),
});

export const healthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  services: z.object({
    database: z.string(),
    supabase: z.string(),
    medicasimple: z.string(),
    webVitals: z.string().optional(),
  }),
});


