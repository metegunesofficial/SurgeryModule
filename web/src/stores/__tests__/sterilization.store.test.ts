import { describe, it, expect, beforeEach } from 'vitest';
import { useSterilizationStore } from '@/stores/sterilization';

describe('useSterilizationStore canReleaseKit', () => {
  beforeEach(() => {
    const { getState, setState } = useSterilizationStore;
    const s = getState();
    setState({ ...s, kits: [], cycles: [], indicators: [], recalls: [], washes: [], events: [] });
  });

  it('allows release when no indicators and no BI result', () => {
    const store = useSterilizationStore.getState();
    const kitId = crypto.randomUUID();
    store.addKit({
      kit_id: kitId,
      name: 'Set A',
      status: 'sterilized',
      location_code: 'ST-01',
    } as any);
    expect(store.canReleaseKit(kitId)).toBe(true);
  });

  it('blocks release when CI fails', () => {
    const store = useSterilizationStore.getState();
    const kitId = crypto.randomUUID();
    store.addKit({ kit_id: kitId, name: 'Set B', status: 'sterilized', location_code: 'ST-02' } as any);
    store.setIndicator(kitId, { ci_result: 'fail' });
    expect(useSterilizationStore.getState().canReleaseKit(kitId)).toBe(false);
  });

  it('blocks release when BI fails on last cycle', () => {
    const store = useSterilizationStore.getState();
    const kitId = crypto.randomUUID();
    const cycleId = crypto.randomUUID();
    store.addCycle({
      cycle_id: cycleId,
      device_id: 'autoclave-1',
      type: 'steam_B',
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      temp_C: 134,
      pressure_bar: 2.1,
      exposure_min: 5,
      result: 'pass',
      operator_id: crypto.randomUUID(),
      BI_result: 'fail',
    } as any);
    store.addKit({ kit_id: kitId, name: 'Set C', status: 'sterilized', location_code: 'ST-03', last_cycle_id: cycleId } as any);
    expect(useSterilizationStore.getState().canReleaseKit(kitId)).toBe(false);
  });
});


