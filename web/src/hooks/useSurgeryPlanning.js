// Custom hook to handle surgery planning store import
import { useState, useEffect } from 'react';

export function useSurgeryPlanning() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Dynamic import of the store
      import('@/stores/surgeryPlanning').then((module) => {
        setStore(module.useSurgeryPlanningStore);
        setLoading(false);
      }).catch((err) => {
        console.error('Failed to load surgery planning store:', err);
        setError(err);
        setLoading(false);
      });
    } catch (err) {
      console.error('Error importing surgery planning store:', err);
      setError(err);
      setLoading(false);
    }
  }, []);

  return { store, loading, error };
}
