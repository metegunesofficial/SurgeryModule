// HL7 v2 / FHIR minimal field maps (placeholders)

export const HL7v2 = {
	ADT: {
		patientId: 'PID-3',
		patientName: 'PID-5',
	},
	SIU: {
		appointmentId: 'SCH-1',
		scheduledStart: 'SCH-11',
	},
	ORM: {
		orderId: 'ORC-2',
		procedureCode: 'OBR-4',
	},
} as const;

export const FHIR = {
	Patient: {
		id: 'Patient.id',
		identifier: 'Patient.identifier',
		name: 'Patient.name',
	},
	Appointment: {
		id: 'Appointment.id',
		start: 'Appointment.start',
		participant: 'Appointment.participant',
	},
	Procedure: {
		id: 'Procedure.id',
		code: 'Procedure.code',
		status: 'Procedure.status',
	},
} as const;


