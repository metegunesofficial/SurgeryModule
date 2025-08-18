import { useAdmissionStore } from '@/stores/admissions';
import { usePharmacyStore } from '@/stores/pharmacy';
import { useSterilizationStore } from '@/stores/sterilization';
import { useSurgeryPlanningStore } from '@/stores/surgeryPlanning';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function runDevSeed() {
  if (typeof window === 'undefined') return;
  if ((window as any).__devSeeded) return;
  // Skip in production and when running tests to avoid flakiness
  const env = (import.meta as any)?.env || {};
  if (env.PROD || env.MODE === 'test' || env.NODE_ENV === 'test') return;

  try {
    seedAdmissions();
    seedPharmacy();
    seedSurgeryPlanning();
    seedSterilization();
    (window as any).__devSeeded = true;
  } catch {
    // best-effort; never throw in dev seed
  }
}

function seedAdmissions() {
  const adStore = useAdmissionStore.getState();
  if ((adStore.wards?.length ?? 0) === 0) {
    try { adStore.seedDemo(); } catch {}
  }

  const wards = useAdmissionStore.getState().wards;
  const rooms = useAdmissionStore.getState().rooms;
  const beds = useAdmissionStore.getState().beds;
  if (!wards.length || !rooms.length || !beds.length) return;

  const now = new Date();

  // Create abundant admission requests
  for (let i = 0; i < 24; i++) {
    const bed = beds[i % beds.length];
    const reqId = crypto.randomUUID();
    adStore.requestAdmission({
      request_id: reqId,
      patient_id: crypto.randomUUID(),
      ward_id: bed.ward_id,
      room_id: bed.room_id,
      bed_id: bed.bed_id,
      attending_physician_id: crypto.randomUUID(),
      planned_start: addMinutes(now, i * 10).toISOString(),
      procedure_code: ['A01','B12','C07','D21'][i % 4],
      anesthesia_required: i % 3 === 0,
      anesthesia_notes: i % 3 === 0 ? 'Genel anestezi planlandı' : undefined,
      barcode: `PAT-${String(i + 1).padStart(3, '0')}`,
      reason: 'Planlı yatış',
      created_by: crypto.randomUUID(),
      created_at: addMinutes(now, -i * 3).toISOString(),
      status: 'pending',
    });
    if (i % 4 === 0) {
      // Some approvals
      try { useAdmissionStore.getState().approveAdmission(reqId); } catch {}
    } else if (i % 7 === 0) {
      // Some rejections
      try { useAdmissionStore.getState().updateAdmissionRequest(reqId, { reason: 'Uygun değil' }); useAdmissionStore.getState().rejectAdmission(reqId); } catch {}
    }
  }

  // Start auto-expire to simulate lifecycle
  try { useAdmissionStore.getState().startAutoExpire(1); } catch {}
}

function seedPharmacy() {
  const ph = usePharmacyStore.getState();
  if ((ph.medications?.length ?? 0) > 0) return;

  const medNames = [
    ['AMOX', 'Amoksisilin'],
    ['PARA', 'Parasetamol'],
    ['IBU', 'İbuprofen'],
    ['CIP', 'Siprofloksasin'],
    ['MET', 'Metronidazol'],
    ['CEF', 'Seftriakson'],
    ['KET', 'Ketorolak'],
    ['MOR', 'Morfin'],
  ];
  const meds = medNames.map(([code, name]) => ({ medication_id: crypto.randomUUID(), code, name, is_controlled: code === 'MOR' }));
  meds.forEach((m) => ph.addMedication(m as any));

  meds.forEach((m, idx) => {
    const lotsCount = 4 + (idx % 3);
    for (let i = 0; i < lotsCount; i++) {
      const lot = {
        lot_id: crypto.randomUUID(),
        medication_id: (m as any).medication_id,
        lot_no: `${m[0]}-${i + 1}`,
        expiry_date: addMinutes(new Date(), 60 * 24 * (15 + i * 5)).toISOString(),
        qty_on_hand: 2 + (i % 4),
        location_code: i % 2 === 0 ? 'MAIN' : 'OR-STORE',
      } as any;
      ph.receiveStock(lot, crypto.randomUUID());
    }
  });
}

function seedSurgeryPlanning() {
  const sp = useSurgeryPlanningStore.getState();
  if ((sp.cases?.length ?? 0) > 0) return;

  const rooms = ['OR-1', 'OR-2', 'OR-3'];
  const procedures = ['Diş çekimi (A01)', 'İmplant (B12)', 'Dolgu (C07)', 'Kanal (D21)'];
  const start = new Date();
  start.setHours(8, 0, 0, 0);
  for (let i = 0; i < 20; i++) {
    sp.addCase({
      case_id: crypto.randomUUID(),
      patient_id: crypto.randomUUID(),
      scheduled_start: addMinutes(start, i * 30).toISOString(),
      estimated_duration_min: 60 + (i % 3) * 30,
      procedure_code: procedures[i % procedures.length],
      room_id: rooms[i % rooms.length],
      surgeon_id: crypto.randomUUID(),
      anesthesia_required: i % 4 === 0,
      ASA_score: (i % 4) + 1,
      status: (['planned', 'in_progress', 'completed'] as const)[i % 3],
    } as any);
  }
}

function seedSterilization() {
  const st = useSterilizationStore.getState();
  if ((st.kits?.length ?? 0) > 0 || (st.cycles?.length ?? 0) > 0) return;

  // Kits
  for (let i = 0; i < 15; i++) {
    const kitId = crypto.randomUUID();
    st.addKit({
      kit_id: kitId,
      name: `Set-${i + 1}`,
      composition: ['Makas', 'Pens', 'Retraktör'].slice(0, (i % 3) + 1),
      status: (['dirty', 'clean', 'packed', 'sterilized'] as const)[i % 4],
      location_code: i % 2 === 0 ? 'CSSD' : 'OR-STORE',
      expiry_date: i % 4 === 3 ? addMinutes(new Date(), 60 * 24 * 90).toISOString() : undefined,
      last_cycle_id: undefined,
    } as any);
    if (i % 3 === 0) {
      st.setIndicator(kitId, { ci_class: String(1 + (i % 6)) as any, ci_result: i % 6 === 0 ? 'fail' : 'pass' });
    }
  }

  // Cycles
  const deviceIds = ['ST-1', 'ST-2'];
  for (let i = 0; i < 10; i++) {
    const start = addMinutes(new Date(), -i * 120);
    const end = addMinutes(start, 90);
    st.addCycle({
      cycle_id: crypto.randomUUID(),
      device_id: deviceIds[i % deviceIds.length],
      type: i % 2 === 0 ? 'steam_B' : 'plasma',
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      temp_C: 134,
      pressure_bar: 2,
      exposure_min: 30,
      result: i % 5 === 0 ? 'fail' : 'pass',
      operator_id: crypto.randomUUID(),
      BI_result: i % 5 === 0 ? 'fail' : 'pass',
      CI_class: (['1','2','3','4','5','6'] as const)[i % 6],
      lot_no: `LOT-${202500 + i}`,
    } as any);
  }

  // Washes and events
  for (let i = 0; i < 12; i++) {
    st.addWash({
      wash_id: crypto.randomUUID(),
      program_code: i % 2 === 0 ? 'W1' : 'W2',
      temp_C: 60 + (i % 3) * 5,
      detergent_lot: i % 3 === 0 ? `DL-${i}` : undefined,
      operator_id: crypto.randomUUID(),
      result: i % 7 === 0 ? 'fail' : 'pass',
    } as any);
    st.addEvent({
      event_id: crypto.randomUUID(),
      kit_id: (st.kits[i % st.kits.length] || st.kits[0]).kit_id,
      event_type: (['received_dirty','washed','packed','sterilized','stored','issued','used'] as const)[i % 7],
      location: i % 3 === 0 ? 'CSSD' : 'OR-STORE',
      ts: addMinutes(new Date(), -i * 15).toISOString(),
      by_user: crypto.randomUUID(),
    } as any);
  }
}


