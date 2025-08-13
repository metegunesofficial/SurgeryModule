import { createContext, useContext, useMemo } from 'react';

const RBACContext = createContext({
  hasPermission: (_actionKey) => true,
});

export function RBACProvider({ children, value }) {
  const ctx = useMemo(() => ({
    hasPermission: (actionKey) => {
      if (value?.hasPermission) return value.hasPermission(actionKey);
      return true; // allow all by default (no behavior change)
    },
  }), [value]);
  return <RBACContext.Provider value={ctx}>{children}</RBACContext.Provider>;
}

export function useRBAC() {
  return useContext(RBACContext);
}

export default useRBAC;


