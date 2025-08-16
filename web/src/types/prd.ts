import { z } from 'zod';

export const SurgeryCaseSchema = z.object({
	case_id: z.string().uuid(),
	patient_id: z.string().uuid(),
	scheduled_start: z.string(),
	estimated_duration_min: z.number().int().nonnegative(),
	procedure_code: z.string(),
	room_id: z.string(),
	surgeon_id: z.string().uuid(),
	anesthesia_required: z.boolean().optional(),
	ASA_score: z.number().optional(),
	status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']),
});

export const OperationNoteSchema = z.object({
	op_note_id: z.string().uuid(),
	case_id: z.string().uuid(),
	indications: z.string(),
	findings: z.string().optional(),
	implants_used: z.array(z.string()).optional(),
	complications: z.string().optional(),
	sign_off_by: z.string().uuid(),
	sign_off_time: z.string(),
});

export const SafetyChecklistSchema = z.object({
	ssc_preop_done: z.boolean(),
	ssc_timeout_done: z.boolean(),
	ssc_postop_done: z.boolean(),
	completed_by: z.string().uuid(),
	timestamps: z.array(z.string()),
});

export const TeamAssignmentSchema = z.object({
	team: z.array(z.string().uuid()),
	roles: z.array(z.string()),
});

// Responsibility matrix mapping role -> user_id for a case or shift
export const ResponsibilityMatrixSchema = z.object({
	context: z.enum(['case','shift']).default('case'),
	case_id: z.string().uuid().optional(),
	shift_id: z.string().uuid().optional(),
	assignments: z.array(
		z.object({
			role: z.enum(['lead_surgeon','assistant_surgeon','anesthetist','scrub_nurse','circulating_nurse','technician','observer']),
			user_id: z.string().uuid(),
		})
	),
});

export const KitVerificationSchema = z.object({
	scanned_kit_ids: z.array(z.string()),
	all_kits_valid: z.boolean(),
});

// Block planning configuration for surgeons/rooms/time blocks
export const BlockPlanSchema = z.object({
	plan_id: z.string().uuid(),
	room_id: z.string(),
	surgeon_id: z.string().uuid(),
	day_of_week: z.enum(['Mon','Tue','Wed','Thu','Fri','Sat','Sun']),
	start_hour: z.number().min(0).max(23),
	end_hour: z.number().min(1).max(24),
});

export const MaterialUsageSchema = z.object({
	item_code: z.string(),
	lot_no: z.string().optional(),
	qty: z.number(),
	udi: z.string().optional(),
});

// Pharmacy domain (basic scaffolding for medication and stock)
export const MedicationSchema = z.object({
	medication_id: z.string().uuid(),
	code: z.string(),
	name: z.string(),
	atc_code: z.string().optional(),
	is_controlled: z.boolean().default(false),
});

export const MedicationLotSchema = z.object({
	lot_id: z.string().uuid(),
	medication_id: z.string().uuid(),
	lot_no: z.string(),
	expiry_date: z.string(),
	qty_on_hand: z.number().nonnegative(),
	location_code: z.string(),
});

export const InventoryMovementSchema = z.object({
	movement_id: z.string().uuid(),
	medication_id: z.string().uuid(),
	lot_id: z.string().uuid(),
	from_location: z.string().optional(),
	to_location: z.string().optional(),
	qty: z.number(),
	type: z.enum(['receive','issue','return','waste','transfer']),
	reason: z.string().optional(),
	ts: z.string(),
	by_user: z.string().uuid(),
});

export const MedicationOrderSchema = z.object({
	order_id: z.string().uuid(),
	patient_id: z.string().uuid(),
	medication_id: z.string().uuid(),
	dose: z.string(),
	route: z.string(),
	frequency: z.string(),
	prn: z.boolean().optional(),
	start_time: z.string(),
	end_time: z.string().optional(),
	status: z.enum(['active','on_hold','stopped','completed']).default('active'),
});

export const MedicationAdministrationSchema = z.object({
	admin_id: z.string().uuid(),
	order_id: z.string().uuid(),
	patient_id: z.string().uuid(),
	lot_id: z.string().uuid().optional(),
	dose_given: z.string(),
	result: z.enum(['given','held','refused','wasted']),
	reason: z.string().optional(),
	administered_at: z.string(),
	administered_by: z.string().uuid(),
	cosigned_by: z.string().uuid().optional(),
});

export const IncidentSchema = z.object({
	incident_id: z.string().uuid(),
	type: z.string(),
	description: z.string(),
	severity: z.enum(['low', 'med', 'high', 'critical']),
	reported_by: z.string().uuid(),
	attachments: z.array(z.string()).optional(),
});

export const AuditLogSchema = z.object({
	action: z.string(),
	actor_id: z.string().uuid(),
	entity: z.string(),
	entity_id: z.string(),
	ts: z.string(),
	delta: z.any().optional(),
});

export const SterilizationKitSchema = z.object({
	kit_id: z.string().uuid(),
	name: z.string(),
	composition: z.array(z.string()).optional(),
	udi: z.string().optional(),
	rfid_tag: z.string().optional(),
	status: z.enum(['dirty','clean','packed','sterilized','expired','issued','used']),
	location_code: z.string(),
	expiry_date: z.string().optional(),
	last_cycle_id: z.string().uuid().optional(),
});

export const SterilizationCycleSchema = z.object({
	cycle_id: z.string().uuid(),
	device_id: z.string(),
	type: z.enum(['steam_B','plasma','other']),
	start_time: z.string(),
	end_time: z.string(),
	temp_C: z.number(),
	pressure_bar: z.number(),
	exposure_min: z.number(),
	vacuum_passes: z.number().optional(),
	result: z.enum(['pass','fail']),
	operator_id: z.string().uuid(),
	BI_result: z.enum(['pass','fail','na']).optional(),
	CI_class: z.enum(['1','2','3','4','5','6']).optional(),
	lot_no: z.string().optional(),
});

export const WashSchema = z.object({
	wash_id: z.string().uuid(),
	program_code: z.string(),
	temp_C: z.number(),
	detergent_lot: z.string().optional(),
	operator_id: z.string().uuid(),
	result: z.enum(['pass','fail']),
});

export const LabelSchema = z.object({
	label_id: z.string().uuid(),
	datamatrix: z.string(),
	printed_at: z.string(),
	printed_by: z.string().uuid(),
	reprint_of: z.string().uuid().optional(),
});

export const ScanEventSchema = z.object({
	event_id: z.string().uuid(),
	kit_id: z.string().uuid(),
	event_type: z.enum(['received_dirty','washed','packed','sterilized','stored','issued','used','returned','recalled']),
	location: z.string(),
	ts: z.string(),
	by_user: z.string().uuid(),
});

export const IndicatorSchema = z.object({
	bi_lot: z.string().optional(),
	bi_read_time: z.string().optional(),
	ci_class: z.string().optional(),
	ci_result: z.enum(['pass','fail']).optional(),
});

export const RecallSchema = z.object({
	recall_id: z.string().uuid(),
	reason: z.string(),
	scope: z.array(z.string()),
	initiated_by: z.string().uuid(),
	initiated_at: z.string(),
	closed_at: z.string().optional(),
});

export type SurgeryCase = z.infer<typeof SurgeryCaseSchema>;
export type OperationNote = z.infer<typeof OperationNoteSchema>;
export type SafetyChecklist = z.infer<typeof SafetyChecklistSchema>;
export type TeamAssignment = z.infer<typeof TeamAssignmentSchema>;
export type ResponsibilityMatrix = z.infer<typeof ResponsibilityMatrixSchema>;
export type KitVerification = z.infer<typeof KitVerificationSchema>;
export type BlockPlan = z.infer<typeof BlockPlanSchema>;
export type MaterialUsage = z.infer<typeof MaterialUsageSchema>;
export type Medication = z.infer<typeof MedicationSchema>;
export type MedicationLot = z.infer<typeof MedicationLotSchema>;
export type InventoryMovement = z.infer<typeof InventoryMovementSchema>;
export type MedicationOrder = z.infer<typeof MedicationOrderSchema>;
export type MedicationAdministration = z.infer<typeof MedicationAdministrationSchema>;
export type Incident = z.infer<typeof IncidentSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type SterilizationKit = z.infer<typeof SterilizationKitSchema>;
export type SterilizationCycle = z.infer<typeof SterilizationCycleSchema>;
export type Wash = z.infer<typeof WashSchema>;
export type Label = z.infer<typeof LabelSchema>;
export type ScanEvent = z.infer<typeof ScanEventSchema>;
export type Indicator = z.infer<typeof IndicatorSchema>;
export type Recall = z.infer<typeof RecallSchema>;

// Inpatient (Admission) domain
export const WardSchema = z.object({
	ward_id: z.string().uuid(),
	name: z.string(),
});

export const RoomSchema = z.object({
	room_id: z.string().uuid(),
	ward_id: z.string().uuid(),
	name: z.string(),
});

export const BedSchema = z.object({
	bed_id: z.string().uuid(),
	room_id: z.string().uuid(),
	ward_id: z.string().uuid(),
	label: z.string(),
	status: z.enum(['vacant','occupied','reserved','cleaning','maintenance']),
});

export const AdmissionSchema = z.object({
	admission_id: z.string().uuid(),
	patient_id: z.string().uuid(),
	ward_id: z.string().uuid(),
	room_id: z.string().uuid(),
	bed_id: z.string().uuid(),
	attending_physician_id: z.string().uuid(),
	admit_time: z.string(),
	diagnosis: z.string().optional(),
	status: z.enum(['requested','admitted','transferred','discharged']).default('admitted'),
});

export const TransferEventSchema = z.object({
	transfer_id: z.string().uuid(),
	admission_id: z.string().uuid(),
	from_ward_id: z.string().uuid(),
	from_room_id: z.string().uuid(),
	from_bed_id: z.string().uuid(),
	to_ward_id: z.string().uuid(),
	to_room_id: z.string().uuid(),
	to_bed_id: z.string().uuid(),
	reason: z.string().optional(),
	ts: z.string(),
});

export const DischargeSchema = z.object({
	discharge_id: z.string().uuid(),
	admission_id: z.string().uuid(),
	decision_time: z.string(),
	discharge_time: z.string(),
	summary: z.string().optional(),
	signed_by: z.string().uuid(),
});

// Admission/Discharge Requests for approval workflow
export const AdmissionRequestSchema = z.object({
	request_id: z.string().uuid(),
	patient_id: z.string().uuid(),
	ward_id: z.string().uuid(),
	room_id: z.string().uuid(),
	bed_id: z.string().uuid(),
	attending_physician_id: z.string().uuid(),
	planned_start: z.string().optional(),
	procedure_code: z.string().optional(),
	anesthesia_required: z.boolean().optional(),
	anesthesia_notes: z.string().optional(),
	barcode: z.string().optional(),
	reason: z.string().optional(),
	created_by: z.string().uuid(),
	created_at: z.string(),
	status: z.enum(['pending','approved','rejected','expired']).default('pending'),
});

export const DischargeRequestSchema = z.object({
	discharge_request_id: z.string().uuid(),
	admission_id: z.string().uuid(),
	summary: z.string().optional(),
	reason: z.string().optional(),
	signed_by_name: z.string().optional(),
	signed_by_id: z.string().uuid().optional(),
	created_by: z.string().uuid(),
	created_at: z.string(),
	status: z.enum(['pending','approved','rejected']).default('pending'),
});

export type Ward = z.infer<typeof WardSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Bed = z.infer<typeof BedSchema>;
export type Admission = z.infer<typeof AdmissionSchema>;
export type TransferEvent = z.infer<typeof TransferEventSchema>;
export type Discharge = z.infer<typeof DischargeSchema>;
export type AdmissionRequest = z.infer<typeof AdmissionRequestSchema>;
export type DischargeRequest = z.infer<typeof DischargeRequestSchema>;


