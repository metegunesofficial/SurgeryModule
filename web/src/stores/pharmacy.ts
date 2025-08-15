import { create } from 'zustand';
import type { Medication, MedicationLot, InventoryMovement, MedicationOrder, MedicationAdministration } from '@/types/prd';

type PharmacyState = {
  medications: Medication[];
  lots: MedicationLot[];
  movements: InventoryMovement[];
  orders: MedicationOrder[];
  administrations: MedicationAdministration[];

  addMedication: (m: Medication) => void;
  receiveStock: (lot: MedicationLot, by_user: string) => void;
  createOrder: (order: MedicationOrder) => void;
  administer: (admin: Omit<MedicationAdministration, 'admin_id'> & { admin_id?: string }) => void;
  returnToStock: (lot_id: string, qty: number, by_user: string) => void;
  wasteFromStock: (lot_id: string, qty: number, reason: string | undefined, by_user: string) => void;
};

function sortLotsFefo(a: MedicationLot, b: MedicationLot): number {
  return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
}

export const usePharmacyStore = create<PharmacyState>((set, get) => ({
  medications: [],
  lots: [],
  movements: [],
  orders: [],
  administrations: [],

  addMedication: (m) => set((s) => ({ medications: [...s.medications, m] })),

  receiveStock: (lot, by_user) => set((s) => ({
    lots: [...s.lots, lot],
    movements: [
      ...s.movements,
      {
        movement_id: crypto.randomUUID(),
        medication_id: lot.medication_id,
        lot_id: lot.lot_id,
        from_location: undefined,
        to_location: lot.location_code,
        qty: lot.qty_on_hand,
        type: 'receive',
        reason: undefined,
        ts: new Date().toISOString(),
        by_user,
      } as InventoryMovement,
    ],
  })),

  createOrder: (order) => set((s) => ({ orders: [...s.orders, order] })),

  administer: (adminInput) => {
    const s = get();
    const order = s.orders.find((o) => o.order_id === adminInput.order_id);
    if (!order) throw new Error('Order not found');
    const med = s.medications.find((m) => m.medication_id === order.medication_id);
    const isControlled = !!med?.is_controlled;
    if (isControlled && !adminInput.cosigned_by) {
      throw new Error('Controlled medication requires co-sign');
    }

    // FEFO: pick earliest expiry lot with stock for this medication, at any location
    const lotsForMed = s.lots
      .filter((l) => l.medication_id === order.medication_id && l.qty_on_hand > 0)
      .sort(sortLotsFefo);
    if (adminInput.result === 'given') {
      const selectedLot = adminInput.lot_id
        ? s.lots.find((l) => l.lot_id === adminInput.lot_id)
        : lotsForMed[0];
      if (!selectedLot || selectedLot.qty_on_hand <= 0) throw new Error('No stock available');
      // Deduct 1 unit per administration (unit‑level model; extend for fractional later)
      set((state) => ({
        lots: state.lots.map((l) => (l.lot_id === selectedLot.lot_id ? { ...l, qty_on_hand: l.qty_on_hand - 1 } : l)),
        movements: [
          ...state.movements,
          {
            movement_id: crypto.randomUUID(),
            medication_id: selectedLot.medication_id,
            lot_id: selectedLot.lot_id,
            from_location: selectedLot.location_code,
            to_location: undefined,
            qty: 1,
            type: 'issue',
            reason: 'administration',
            ts: new Date().toISOString(),
            by_user: adminInput.administered_by,
          } as InventoryMovement,
        ],
        administrations: [
          ...state.administrations,
          {
            admin_id: adminInput.admin_id || crypto.randomUUID(),
            order_id: adminInput.order_id,
            patient_id: adminInput.patient_id,
            lot_id: selectedLot.lot_id,
            dose_given: adminInput.dose_given,
            result: 'given',
            reason: adminInput.reason,
            administered_at: adminInput.administered_at,
            administered_by: adminInput.administered_by,
            cosigned_by: adminInput.cosigned_by,
          } as MedicationAdministration,
        ],
      }));
      return;
    }

    // Non‑given events are recorded without stock deduction
    set((state) => ({
      administrations: [
        ...state.administrations,
        {
          admin_id: adminInput.admin_id || crypto.randomUUID(),
          order_id: adminInput.order_id,
          patient_id: adminInput.patient_id,
          lot_id: adminInput.lot_id,
          dose_given: adminInput.dose_given,
          result: adminInput.result,
          reason: adminInput.reason,
          administered_at: adminInput.administered_at,
          administered_by: adminInput.administered_by,
          cosigned_by: adminInput.cosigned_by,
        } as MedicationAdministration,
      ],
    }));
  },

  returnToStock: (lot_id, qty, by_user) => set((s) => ({
    lots: s.lots.map((l) => (l.lot_id === lot_id ? { ...l, qty_on_hand: l.qty_on_hand + qty } : l)),
    movements: [
      ...s.movements,
      {
        movement_id: crypto.randomUUID(),
        medication_id: s.lots.find((l) => l.lot_id === lot_id)?.medication_id || '' as unknown as string,
        lot_id,
        from_location: undefined,
        to_location: s.lots.find((l) => l.lot_id === lot_id)?.location_code,
        qty,
        type: 'return',
        reason: undefined,
        ts: new Date().toISOString(),
        by_user,
      } as InventoryMovement,
    ],
  })),

  wasteFromStock: (lot_id, qty, reason, by_user) => set((s) => ({
    lots: s.lots.map((l) => (l.lot_id === lot_id ? { ...l, qty_on_hand: Math.max(0, l.qty_on_hand - qty) } : l)),
    movements: [
      ...s.movements,
      {
        movement_id: crypto.randomUUID(),
        medication_id: s.lots.find((l) => l.lot_id === lot_id)?.medication_id || '' as unknown as string,
        lot_id,
        from_location: s.lots.find((l) => l.lot_id === lot_id)?.location_code,
        to_location: undefined,
        qty,
        type: 'waste',
        reason,
        ts: new Date().toISOString(),
        by_user,
      } as InventoryMovement,
    ],
  })),
}));


