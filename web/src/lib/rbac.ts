export type RBACAction =
	| 'create:surgery-schedule'
	| 'run:conflict-check'
	| 'create:sterilization-cycle'
	| 'update:operation-note'
	| 'read:audit-log'
	| 'create:incident'
	| 'read:sterilization-cycle'
	| 'update:kit-status'
	| 'admission:create'
	| 'admission:transfer'
	| 'admission:discharge'
	| 'admission:approve';

export type RBACRole = 'admin' | 'surgeon' | 'nurse' | 'tech' | 'manager' | 'auditor';

export const ROLE_DEFAULT_PERMS: Record<RBACRole, ReadonlyArray<RBACAction>> = {
	admin: [
		'create:surgery-schedule',
		'run:conflict-check',
		'create:sterilization-cycle',
		'update:operation-note',
		'read:audit-log',
		'create:incident',
		'read:sterilization-cycle',
		'update:kit-status',
		'admission:create',
		'admission:transfer',
		'admission:discharge',
		'admission:approve',
	],
	surgeon: ['create:surgery-schedule', 'update:operation-note', 'admission:create', 'admission:discharge'],
	nurse: ['create:sterilization-cycle', 'read:sterilization-cycle', 'update:kit-status', 'admission:create', 'admission:transfer'],
	tech: ['create:sterilization-cycle', 'read:sterilization-cycle', 'update:kit-status'],
	manager: ['read:audit-log', 'run:conflict-check', 'admission:approve'],
	auditor: ['read:audit-log'],
};


