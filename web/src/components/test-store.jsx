// Test component to isolate store import issue
import { useSterilizationStore } from '@/stores/sterilization';
import { useTestStore } from '@/stores/test-store';
import { useSurgeryPlanning } from '@/hooks/useSurgeryPlanning';

export function TestStoreComponent() {
  try {
    // Test simple store first
    const { testValue } = useTestStore();

    // Test sterilization store
    const { cycles } = useSterilizationStore();

    // Test surgery planning store using custom hook
    const { store: useSurgeryStore, loading, error } = useSurgeryPlanning();

    if (loading) {
      return (
        <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
          <h3 className="font-bold">Store Test Loading...</h3>
          <p>Loading surgery planning store...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 border rounded bg-red-50 text-red-800">
          <h3 className="font-bold">Store Test Failed!</h3>
          <p>Error: {error.message}</p>
          <p>Stack: {error.stack}</p>
        </div>
      );
    }

    const cases = useSurgeryStore ? useSurgeryStore().cases : [];

    return (
      <div className="p-4 border rounded bg-green-50 text-green-800">
        <h3 className="font-bold">Store Test Successful!</h3>
        <p>Test value: {testValue}</p>
        <p>Surgery cases: {cases.length}</p>
        <p>Sterilization cycles: {cycles.length}</p>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 border rounded bg-red-50 text-red-800">
        <h3 className="font-bold">Store Test Failed!</h3>
        <p>Error: {error.message}</p>
        <p>Stack: {error.stack}</p>
      </div>
    );
  }
}
