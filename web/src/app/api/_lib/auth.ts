export type Role =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'technician'
  | 'quality_manager'
  | 'guest';

export function getUserRole(req: Request): Role {
  const raw = req.headers.get('x-role')?.toLowerCase();
  switch (raw) {
    case 'admin':
    case 'doctor':
    case 'nurse':
    case 'technician':
    case 'quality_manager':
      return raw as Role;
    default:
      return 'guest';
  }
}

export function requireRole(req: Request, allowed: Role[]): Response | null {
  const role = getUserRole(req);
  if (!allowed.includes(role)) {
    return new Response(
      JSON.stringify({ error: 'Insufficient permissions' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  return null;
}


