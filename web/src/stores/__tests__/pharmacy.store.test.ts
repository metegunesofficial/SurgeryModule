import { describe, it, expect, beforeEach } from 'vitest';
import { usePharmacyStore } from '../pharmacy';

describe('Pharmacy store', () => {
  beforeEach(() => {
    usePharmacyStore.setState({ medications: [], lots: [], movements: [], orders: [], administrations: [] });
  });

  it('deducts FEFO lot on administration (given)', () => {
    const medId = crypto.randomUUID();
    usePharmacyStore.setState((s) => ({
      medications: [{ medication_id: medId, code: 'AMOX', name: 'Amoxicillin', is_controlled: false } as any],
    }));
    const lot1 = { lot_id: crypto.randomUUID(), medication_id: medId, lot_no: 'A', expiry_date: new Date(Date.now() + 3*24*3600*1000).toISOString(), qty_on_hand: 1, location_code: 'MAIN' } as any;
    const lot2 = { lot_id: crypto.randomUUID(), medication_id: medId, lot_no: 'B', expiry_date: new Date(Date.now() + 1*24*3600*1000).toISOString(), qty_on_hand: 1, location_code: 'MAIN' } as any;
    usePharmacyStore.getState().receiveStock(lot1, crypto.randomUUID());
    usePharmacyStore.getState().receiveStock(lot2, crypto.randomUUID());
    const orderId = crypto.randomUUID();
    const patientId = crypto.randomUUID();
    usePharmacyStore.getState().createOrder({ order_id: orderId, patient_id: patientId, medication_id: medId, dose: '500 mg', route: 'po', frequency: 'bid', start_time: new Date().toISOString(), status: 'active' } as any);

    usePharmacyStore.getState().administer({ order_id: orderId, patient_id: patientId, dose_given: '500 mg', result: 'given', administered_at: new Date().toISOString(), administered_by: crypto.randomUUID() });

    const { lots, movements, administrations } = usePharmacyStore.getState();
    const earliestLot = [lot1, lot2].sort((a,b)=> new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())[0];
    expect(lots.find(l=>l.lot_id===earliestLot.lot_id)?.qty_on_hand).toBe(0);
    expect(movements.at(-1)?.type).toBe('issue');
    expect(administrations.at(-1)?.result).toBe('given');
  });

  it('requires co-sign for controlled medications', () => {
    const medId = crypto.randomUUID();
    usePharmacyStore.setState({ medications: [{ medication_id: medId, code: 'MOR', name: 'Morphine', is_controlled: true } as any], lots: [], movements: [], orders: [], administrations: [] });
    const orderId = crypto.randomUUID();
    const patientId = crypto.randomUUID();
    usePharmacyStore.getState().createOrder({ order_id: orderId, patient_id: patientId, medication_id: medId, dose: '2 mg', route: 'iv', frequency: 'q4h', start_time: new Date().toISOString(), status: 'active' } as any);
    expect(() => usePharmacyStore.getState().administer({ order_id: orderId, patient_id: patientId, dose_given: '2 mg', result: 'given', administered_at: new Date().toISOString(), administered_by: crypto.randomUUID() })).toThrow();
  });
});


