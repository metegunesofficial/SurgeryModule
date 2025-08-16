type AuditEntry = {
	action: string;
	actor_id: string;
	entity: string;
	entity_id: string;
	ts: string;
	delta?: any;
};

const _auditLog: AuditEntry[] = [];

export function logAudit(entry: AuditEntry) {
	_auditLog.push(entry);
	if (process.env.NODE_ENV !== 'test') {
		try { console.debug('[AUDIT]', entry); } catch {}
	}
}

export function getAuditLog(): ReadonlyArray<AuditEntry> {
	return _auditLog;
}


