import { createContext, useContext, useMemo } from 'react';
import { ROLE_DEFAULT_PERMS } from '@/lib/rbac';

const RBACContext = createContext({
  hasPermission: (_actionKey) => true,
});

export function RBACProvider({ children, value }) {
  const ctx = useMemo(() => ({
    hasPermission: (actionKey) => {
      if (value?.hasPermission) return value.hasPermission(actionKey);
      // Optional: derive role from localStorage/session if present
      const role = value?.role || (typeof window !== 'undefined' ? window.localStorage.getItem('app:role') : null);
      if (role && ROLE_DEFAULT_PERMS[role]) {
        return ROLE_DEFAULT_PERMS[role].includes(actionKey);
      }
      return true; // allow all by default (no behavior change)
    },
  }), [value]);
  return <RBACContext.Provider value={ctx}>{children}</RBACContext.Provider>;
}

export function useRBAC() {
  return useContext(RBACContext);
}

export default useRBAC;


