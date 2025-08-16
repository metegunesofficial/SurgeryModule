import { useRBAC } from "@/utils/useRBAC.jsx";

export function RBACGuard({ action, children }) {
  const { hasPermission } = useRBAC();
  if (!hasPermission(action)) return null;
  return children;
}

export default RBACGuard;


