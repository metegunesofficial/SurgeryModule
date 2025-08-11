"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
  patientName: z.string().min(1),
  procedureType: z.string().min(1),
  scheduledStart: z.string().min(1),
  estimatedDuration: z.number().int().min(1),
});
type FormValues = z.infer<typeof FormSchema>;

export default function SurgeriesPage() {
  const qc = useQueryClient();
  const listQ = useQuery({
    queryKey: ['surgeries'],
    queryFn: async () => {
      const res = await fetch('/api/surgeries');
      return res.json();
    },
  });

  const createM = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await fetch('/api/surgeries', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-role': 'doctor' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Create failed');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['surgeries'] }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      patientName: '',
      procedureType: '',
      scheduledStart: new Date().toISOString().slice(0,16),
      estimatedDuration: 60,
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ameliyatlar</h1>
        <p className="text-sm text-black/70">Basit liste ve oluşturma formu</p>
      </div>

      <form className="grid gap-3 max-w-xl" onSubmit={handleSubmit((v)=>createM.mutate(v))}>
        <div>
          <label className="block text-sm">Hasta Adı</label>
          <input className="border rounded px-2 py-1 w-full" {...register('patientName')} />
          {errors.patientName && <p className="text-red-600 text-sm">{errors.patientName.message}</p>}
        </div>
        <div>
          <label className="block text-sm">İşlem Türü</label>
          <input className="border rounded px-2 py-1 w-full" {...register('procedureType')} />
          {errors.procedureType && <p className="text-red-600 text-sm">{errors.procedureType.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Başlangıç</label>
          <input type="datetime-local" className="border rounded px-2 py-1 w-full" {...register('scheduledStart')} />
          {errors.scheduledStart && <p className="text-red-600 text-sm">{errors.scheduledStart.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Süre (dk)</label>
          <input type="number" className="border rounded px-2 py-1 w-full" {...register('estimatedDuration', { valueAsNumber: true })} />
          {errors.estimatedDuration && <p className="text-red-600 text-sm">{errors.estimatedDuration.message}</p>}
        </div>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-1" type="button" onClick={()=>reset()}>Temizle</button>
          <button className="border rounded px-3 py-1 bg-black text-white" type="submit" disabled={createM.isPending}>Kaydet</button>
        </div>
        {createM.isSuccess && <p className="text-green-700 text-sm">Kayıt oluşturuldu.</p>}
        {createM.isError && <p className="text-red-700 text-sm">Kayıt oluşturulamadı.</p>}
      </form>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Liste</h2>
        {listQ.isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 card animate-pulse" />
            ))}
          </div>
        ) : listQ.isError ? (
          <p className="text-red-700 text-sm">Liste yüklenemedi.</p>
        ) : listQ.data?.items?.length ? (
          <ul className="divide-y border rounded">
            {listQ.data.items.map((s: { id: string; patientName: string; procedureType: string; scheduledStart: string; estimatedDuration: number; })=> (
              <li key={s.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.patientName} — {s.procedureType}</div>
                  <div className="text-sm text-black/70">{new Date(s.scheduledStart).toLocaleString()} · {s.estimatedDuration} dk</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-black/70">Kayıt yok</p>
        )}
      </div>
    </div>
  );
}


