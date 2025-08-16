import { create } from 'zustand';
import type { Admission, Bed, Discharge, TransferEvent, Ward, Room, AdmissionRequest, DischargeRequest } from '@/types/prd';
import { postOpSendToSterilization } from '@/lib/providers/sterilization/mock';
import { validateBedVacant, reserveBed, releaseBed } from '@/lib/hbys';
import { logAudit } from '@/lib/audit';
import { withRetry } from '@/lib/retry';

type AdmissionState = {
	wards: Ward[];
	rooms: Room[];
	beds: Bed[];
	admissions: Admission[];
	transfers: TransferEvent[];
	discharges: Discharge[];
  admissionRequests: AdmissionRequest[];
  dischargeRequests: DischargeRequest[];
  errors: string[];

	seedDemo: () => void;
	admit: (a: Admission) => void;
	transfer: (t: TransferEvent) => void;
	discharge: (d: Discharge) => void;
  requestAdmission: (r: AdmissionRequest) => void;
  approveAdmission: (request_id: string) => void;
  rejectAdmission: (request_id: string) => void;
  expireAdmission: (request_id: string) => void;
  requestDischarge: (r: DischargeRequest) => void;
  approveDischarge: (discharge_request_id: string) => Promise<void>;
  rejectDischarge: (discharge_request_id: string) => void;
  pushError: (msg: string) => void;
  clearErrors: () => void;
  startAutoExpire: (pendingSeconds?: number) => void;
  updateAdmissionRequest: (request_id: string, patch: Partial<AdmissionRequest>) => void;
  updateDischargeRequest: (discharge_request_id: string, patch: Partial<DischargeRequest>) => void;
};

export const useAdmissionStore = create<AdmissionState>((set, get) => ({
	wards: [],
	rooms: [],
	beds: [],
	admissions: [],
	transfers: [],
	discharges: [],
  admissionRequests: [],
  dischargeRequests: [],
  errors: [],

	seedDemo: () => set(() => {
		// Create wards
		const wardDental: Ward = { ward_id: crypto.randomUUID(), name: 'Diş Servisi' };
		const wardDay: Ward = { ward_id: crypto.randomUUID(), name: 'Günübirlik' };

		// Create rooms
		const rooms: Room[] = [
			{ room_id: crypto.randomUUID(), ward_id: wardDental.ward_id, name: 'Dış-101' },
			{ room_id: crypto.randomUUID(), ward_id: wardDental.ward_id, name: 'Dış-102' },
			{ room_id: crypto.randomUUID(), ward_id: wardDay.ward_id, name: 'G-201' },
			{ room_id: crypto.randomUUID(), ward_id: wardDay.ward_id, name: 'G-202' },
		];

		// Create beds (2 per room)
		const beds: Bed[] = rooms.flatMap((room, idx) => {
			const b1: Bed = {
				bed_id: crypto.randomUUID(),
				ward_id: room.ward_id,
				room_id: room.room_id,
				label: `${room.name}-A`,
				status: idx % 2 === 0 ? 'vacant' : 'occupied',
			};
			const b2: Bed = {
				bed_id: crypto.randomUUID(),
				ward_id: room.ward_id,
				room_id: room.room_id,
				label: `${room.name}-B`,
				status: 'vacant',
			};
			return [b1, b2];
		});

		return {
			wards: [wardDental, wardDay],
			rooms,
			beds,
		};
	}),

	admit: (a) => {
		// Fire-and-forget HBYS validations to keep behavior unchanged in demo
		try {
			withRetry(() => validateBedVacant(a.bed_id), 1, 200)
				.then(() => withRetry(() => reserveBed(a.bed_id), 1, 200))
				.catch(() => { try { get().pushError?.('HBYS doğrulama/rezervasyon hatası'); } catch {} });
		} catch {}
		set((s) => ({
		admissions: [...s.admissions, a],
		beds: s.beds.map((b) => (b.bed_id === a.bed_id ? { ...b, status: 'occupied' } : b)),
		}));
		logAudit({ action: 'admission.create', actor_id: a.attending_physician_id, entity: 'admission', entity_id: a.admission_id, ts: new Date().toISOString(), delta: a });
	},
	transfer: (t) => {
		// HBYS reservation switch (fire-and-forget)
		try {
			withRetry(() => releaseBed(t.from_bed_id), 1, 200).catch(()=>{ try { get().pushError?.('HBYS yatak bırakma hatası'); } catch {} });
			withRetry(() => reserveBed(t.to_bed_id), 1, 200).catch(()=>{ try { get().pushError?.('HBYS yatak rezervasyon hatası'); } catch {} });
		} catch {}
		set((s) => ({
		transfers: [...s.transfers, t],
		admissions: s.admissions.map((a) => (a.admission_id === t.admission_id ? {
			...a,
			ward_id: t.to_ward_id,
			room_id: t.to_room_id,
			bed_id: t.to_bed_id,
			status: 'transferred',
		} : a)),
		beds: s.beds.map((b) => {
			if (b.bed_id === t.from_bed_id) return { ...b, status: 'vacant' };
			if (b.bed_id === t.to_bed_id) return { ...b, status: 'occupied' };
			return b;
		}),
		}));
		logAudit({ action: 'admission.transfer', actor_id: t.admission_id, entity: 'admission', entity_id: t.admission_id, ts: new Date().toISOString(), delta: t });
	},
	discharge: (d) => {
		// HBYS release and sterilization linkage
		try { releaseBed(get().admissions.find(a=>a.admission_id===d.admission_id)?.bed_id || '').catch(()=>{}); } catch {}
		set((s) => ({
		discharges: [...s.discharges, d],
		admissions: s.admissions.map((a) => (a.admission_id === d.admission_id ? { ...a, status: 'discharged' } : a)),
		beds: s.beds.map((b) => {
			const adm = s.admissions.find((a) => a.admission_id === d.admission_id);
			if (adm && b.bed_id === adm.bed_id) return { ...b, status: 'vacant' };
			return b;
		}),
		}));
		try { postOpSendToSterilization(d.admission_id); } catch {}
		logAudit({ action: 'admission.discharge', actor_id: d.signed_by, entity: 'admission', entity_id: d.admission_id, ts: new Date().toISOString(), delta: d });
	},

  requestAdmission: (r) => set((s) => ({
    admissionRequests: [...s.admissionRequests, r],
    beds: s.beds.map(b => (b.bed_id === r.bed_id ? { ...b, status: 'reserved' } : b)),
  })),
  approveAdmission: (request_id) => set((s) => {
    const req = s.admissionRequests.find(x => x.request_id === request_id);
    if (!req) return {} as any;
    if (!req.reason || req.reason.trim().length === 0) {
      try { get().pushError?.('Yatış onayı için gerekçe zorunlu.'); } catch {}
      return {} as any;
    }
    const newAdmission: Admission = {
      admission_id: crypto.randomUUID(),
      patient_id: req.patient_id,
      ward_id: req.ward_id,
      room_id: req.room_id,
      bed_id: req.bed_id,
      attending_physician_id: req.attending_physician_id,
      admit_time: new Date().toISOString(),
      status: 'admitted',
    } as Admission;
    logAudit({ action: 'admission.approve', actor_id: req.created_by, entity: 'admission_request', entity_id: req.request_id, ts: new Date().toISOString(), delta: req });
    return {
      admissions: [...s.admissions, newAdmission],
      beds: s.beds.map(b => (b.bed_id === newAdmission.bed_id ? { ...b, status: 'occupied' } : b)),
      admissionRequests: s.admissionRequests.map(x => x.request_id === request_id ? { ...x, status: 'approved' } : x),
    };
  }),
  rejectAdmission: (request_id) => set((s) => {
    const req = s.admissionRequests.find(x => x.request_id === request_id);
    if (!req) return {} as any;
    if (!req.reason || req.reason.trim().length === 0) {
      try { get().pushError?.('Yatış red için gerekçe zorunlu.'); } catch {}
      return {} as any;
    }
    logAudit({ action: 'admission.reject', actor_id: req.created_by, entity: 'admission_request', entity_id: req.request_id, ts: new Date().toISOString(), delta: req });
    return {
      admissionRequests: s.admissionRequests.map(x => x.request_id === request_id ? { ...x, status: 'rejected' } : x),
      beds: s.beds.map(b => (b.bed_id === req.bed_id ? { ...b, status: 'vacant' } : b)),
    };
  }),
  expireAdmission: (request_id) => set((s) => ({
    admissionRequests: s.admissionRequests.map(x => x.request_id === request_id ? { ...x, status: 'expired' } : x),
    beds: (() => {
      const req = s.admissionRequests.find(x => x.request_id === request_id);
      if (!req) return s.beds;
      return s.beds.map(b => (b.bed_id === req.bed_id ? { ...b, status: 'vacant' } : b));
    })(),
  })),

  requestDischarge: (r) => set((s) => ({
    dischargeRequests: [...s.dischargeRequests, r],
  })),
  approveDischarge: async (discharge_request_id) => {
    const { discharge } = get();
    const s = get();
    const dr = s.dischargeRequests.find(x => x.discharge_request_id === discharge_request_id);
    if (!dr) return;
    if (!dr.reason || !dr.signed_by_name || !dr.signed_by_id) {
      try { get().pushError?.('Taburcu onayı için gerekçe ve imza bilgileri zorunlu.'); } catch {}
      return;
    }
    // Create discharge and free bed
    discharge({
      discharge_id: crypto.randomUUID(),
      admission_id: dr.admission_id,
      decision_time: new Date().toISOString(),
      discharge_time: new Date().toISOString(),
      summary: dr.summary,
      signed_by: dr.signed_by_id || crypto.randomUUID(),
    });
    // Trigger sterilization flow (mock)
    try { await postOpSendToSterilization(dr.admission_id); } catch {}
    set((state) => ({
      dischargeRequests: state.dischargeRequests.map(x => x.discharge_request_id === discharge_request_id ? { ...x, status: 'approved' } : x),
    }));
    logAudit({ action: 'discharge.approve', actor_id: dr.created_by, entity: 'discharge_request', entity_id: dr.discharge_request_id, ts: new Date().toISOString(), delta: dr });
  },
  rejectDischarge: (discharge_request_id) => set((s) => {
    const dr = s.dischargeRequests.find(x => x.discharge_request_id === discharge_request_id);
    if (!dr) return {} as any;
    if (!dr.reason || dr.reason.trim().length === 0) {
      try { get().pushError?.('Taburcu red için gerekçe zorunlu.'); } catch {}
      return {} as any;
    }
    logAudit({ action: 'discharge.reject', actor_id: dr.created_by, entity: 'discharge_request', entity_id: dr.discharge_request_id, ts: new Date().toISOString(), delta: dr });
    return {
      dischargeRequests: s.dischargeRequests.map(x => x.discharge_request_id === discharge_request_id ? { ...x, status: 'rejected' } : x),
    };
  }),
  pushError: (msg) => set((s) => ({ errors: [...s.errors, msg] })),
  clearErrors: () => set(() => ({ errors: [] })),
  startAutoExpire: (pendingSeconds = 60 * 60 * 2) => {
    try {
      // Run in browser environment only
      if (typeof window === 'undefined') return;
      const existing = (window as any).__admissionAutoExpireTimer as number | undefined;
      if (existing) window.clearInterval(existing);
      const handle = window.setInterval(() => {
        const state = get();
        const now = Date.now();
        const thresholdMs = pendingSeconds * 1000;
        state.admissionRequests
          .filter((r) => r.status === 'pending')
          .forEach((r) => {
            const ageMs = now - new Date(r.created_at).getTime();
            if (ageMs > thresholdMs) {
              state.expireAdmission(r.request_id);
              try { state.pushError?.('Yatış istemi süre aşımı ile kapatıldı'); } catch {}
            }
          });
      }, 30 * 1000);
      (window as any).__admissionAutoExpireTimer = handle;
    } catch {}
  },
  updateAdmissionRequest: (request_id, patch) => set((s) => ({
    admissionRequests: s.admissionRequests.map(r => r.request_id === request_id ? { ...r, ...patch } : r),
  })),
  updateDischargeRequest: (discharge_request_id, patch) => set((s) => ({
    dischargeRequests: s.dischargeRequests.map(r => r.discharge_request_id === discharge_request_id ? { ...r, ...patch } : r),
  })),
}));


