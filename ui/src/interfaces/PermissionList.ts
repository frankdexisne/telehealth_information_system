export const DEPARTMENT_LIST: string = "departments.index";
export const DEPARTMENT_CREATE: string = "departments.store";
export const DEPARTMENT_UPDATE: string = "departments.update";
export const DEPARTMENT_DELETE: string = "departments.destroy";

export const ROLE_LIST: string = "roles.index";
export const ROLE_CREATE: string = "roles.store";
export const ROLE_UPDATE: string = "roles.update";
export const ROLE_DELETE: string = "roles.destroy";

export const USER_LIST: string = "users.index";
export const USER_CREATE: string = "users.store";
export const USER_UPDATE: string = "users.update";
export const USER_DELETE: string = "users.destroy";

export const PATIENT_LIST: string = "patients.index";
export const PATIENT_CREATE: string = "patients.store";
export const PATIENT_UPDATE: string = "patients.update";
export const PATIENT_DELETE: string = "patients.destroy";
export const PATIENT_BIND: string = "patients.bind";

export const CHIEF_COMPLAINT_LIST: string = "patient_chief_complaints.index";
export const CHIEF_COMPLAINT_CREATE: string = "patient_chief_complaints.store";
export const CHIEF_COMPLAINT_CREATE_FOLLOW_UP: string =
  "patient_chief_complaints.createFollowUp";
export const CHIEF_COMPLAINT_UPDATE: string = "patient_chief_complaints.update";
export const CHIEF_COMPLAINT_DELETE: string =
  "patient_chief_complaints.destroy";

export const ENCOUNTER_TRIAGE_TO_DEPARTMENT: string =
  "encounters.triageToDepartment";
export const ENCOUNTER_ASSIGN: string = "encounters.assign";

export const TELECLERK_LOG_LIST: string = "teleclerkLogs.index";
export const TELECLERK_LOG_CREATE: string = "teleclerkLogs.store";
export const TELECLERK_LOG_UPDATE: string = "teleclerkLogs.update";
export const TELECLERK_LOG_DELETE: string = "teleclerkLogs.destroy";

export const CONSULTATION_NEW: string = "consultations.newConsultations";
export const CONSULTATION_FOLLOW_UP: string =
  "consultations.followUpConsultations";
export const CONSULTATION_ADDITIONAL_ADVICE: string =
  "consultations.additionalAdviceConsultations";
export const CONSULTATION_FOR_ATTACHMENT: string =
  "consultations.forAttachmentConsultations";
export const CONSULTATION_FOR_PRESCRIPTION: string =
  "consultations.forPrescriptionConsultations";
export const CONSULTATION_OUT_WHEN_CALLED: string =
  "consultations.outWhenCalledConsultations";
export const CONSULTATION_HOMIS_MAPPING: string =
  "consultations.homisMappingConsultations";
export const CONSULTATION_UNTRIAGE: string =
  "consultations.unTriageConsultations";
export const CONSULTATION_TRIAGED: string =
  "consultations.triagedConsultations";
export const CONSULTATION_ACTIVE: string = "consultations.activeConsultations";
export const CONSULTATION_REASSIGN: string =
  "consultations.assignedConsultations";
export const CONSULTATION_COMPLETED: string =
  "consultations.completedConsultations";

export const DOCTORS_UNFINISH_CONSULTATION: string =
  "doctors.unFinishedConsultations";
export const DOCTORS_NEW_CONSULTATION: string = "doctors.newConsultations";
export const DOCTORS_FOLLOW_UP_CONSULTATION: string =
  "doctors.followUpConsultations";
export const DOCTORS_ACTIVE_CONSULTATION: string =
  "doctors.activeConsultations";
export const DOCTORS_COMPLETED_CONSULTATION: string =
  "doctors.completedConsultations";
export const DOCTORS_SCHEDULED_CONSULTATION: string =
  "doctors.scheduleConsultations";
export const DOCTORS_OUT_WHEN_CALLED: string =
  "doctors.outWhenCalledConsultations";

type PermissionList =
  | typeof DEPARTMENT_LIST
  | typeof DEPARTMENT_CREATE
  | typeof DEPARTMENT_UPDATE
  | typeof DEPARTMENT_DELETE
  | typeof ROLE_LIST
  | typeof ROLE_CREATE
  | typeof ROLE_UPDATE
  | typeof ROLE_DELETE
  | typeof TELECLERK_LOG_LIST
  | typeof TELECLERK_LOG_CREATE
  | typeof TELECLERK_LOG_UPDATE
  | typeof TELECLERK_LOG_DELETE
  | typeof USER_LIST
  | typeof USER_CREATE
  | typeof USER_UPDATE
  | typeof USER_DELETE
  | typeof PATIENT_LIST
  | typeof PATIENT_CREATE
  | typeof PATIENT_UPDATE
  | typeof PATIENT_DELETE
  | typeof PATIENT_BIND
  | typeof CHIEF_COMPLAINT_LIST
  | typeof CHIEF_COMPLAINT_CREATE
  | typeof CHIEF_COMPLAINT_CREATE_FOLLOW_UP
  | typeof CHIEF_COMPLAINT_UPDATE
  | typeof CHIEF_COMPLAINT_DELETE
  | typeof ENCOUNTER_TRIAGE_TO_DEPARTMENT
  | typeof ENCOUNTER_ASSIGN
  | typeof CONSULTATION_NEW
  | typeof CONSULTATION_FOLLOW_UP
  | typeof CONSULTATION_ADDITIONAL_ADVICE
  | typeof CONSULTATION_FOR_ATTACHMENT
  | typeof CONSULTATION_FOR_PRESCRIPTION
  | typeof CONSULTATION_OUT_WHEN_CALLED
  | typeof CONSULTATION_HOMIS_MAPPING
  | typeof CONSULTATION_UNTRIAGE
  | typeof CONSULTATION_TRIAGED
  | typeof CONSULTATION_ACTIVE
  | typeof CONSULTATION_REASSIGN
  | typeof DOCTORS_NEW_CONSULTATION
  | typeof DOCTORS_UNFINISH_CONSULTATION
  | typeof DOCTORS_ACTIVE_CONSULTATION
  | typeof DOCTORS_COMPLETED_CONSULTATION
  | typeof DOCTORS_FOLLOW_UP_CONSULTATION
  | typeof DOCTORS_OUT_WHEN_CALLED
  | typeof DOCTORS_SCHEDULED_CONSULTATION;

export default PermissionList;
