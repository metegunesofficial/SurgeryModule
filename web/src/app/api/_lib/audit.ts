type AuditEntry = {
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
};

export async function auditLog(entry: Omit<AuditEntry, 'timestamp'>) {
  const record: AuditEntry = { ...entry, timestamp: new Date().toISOString() };
  // Placeholder: send to external log service later
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info('[AUDIT]', record);
  }
}


