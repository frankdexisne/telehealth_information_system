<?php

namespace App\Enums;

enum Permission: string
{
    const PATIENT_LIST = 'patients.index';
    const PATIENT_CREATE = 'patients.store';
    const PATIENT_UPDATE = 'patients.update';
    const PATIENT_DELETE = 'patients.destroy';
    const PATIENT_ATTACHMENT = 'patients.attachments';
    const PATIENT_BIND = 'patients.bind';

    const TELECLERK_LOG_LIST = 'teleclerkLogs.index';
    const TELECLERK_LOG_CREATE = 'teleclerkLogs.store';
    const TELECLERK_LOG_UPDATE = 'teleclerkLogs.update';
    const TELECLERK_LOG_DELETE = 'teleclerkLogs.destroy';

    const CHIEF_COMPLAINT_LIST = 'patient_chief_complaints.index';
    const CHIEF_COMPLAINT_CREATE = 'patient_chief_complaints.store';
    const CHIEF_COMPLAINT_CREATE_FOLLOW_UP = 'patient_chief_complaints.createFollowUp';
    const CHIEF_COMPLAINT_UPDATE = 'patient_chief_complaints.update';
    const CHIEF_COMPLAINT_DELETE = 'patient_chief_complaints.destroy';

    const PATIENT_SCHEDULE_LIST = 'patient-schedules.index';
    const PATIENT_SCHEDULE_DELETE = 'patient-schedules.destroy';

    const ENCOUNTER_TRIAGE_TO_DEPARTMENT = 'encounters.triageToDepartment';
    const ENCOUNTER_ASSIGN = 'encounters.assign';

    const DOCTOR_NEW_CONSULTATIONS = 'doctors.newConsultations';
    const DOCTOR_FOLLOW_UP_CONSULTATIONS = 'doctors.followUpConsultations';
    const DOCTOR_UNFINISH_CONSULTATIONS = 'doctors.unFinishedConsultations';
    const DOCTOR_ACTIVE_CONSULTATIONS = 'doctors.activeConsultations';
    const DOCTOR_COMPLETED_CONSULTATIONS = 'doctors.completedConsultations';
    const DOCTOR_OUT_WHEN_CALLED_CONSULTATIONS = 'doctors.outWhenCalledConsultations';
    const DOCTOR_SCHEDULED_CONSULTATIONS = 'doctors.scheduleConsultations';

    const NEW_CONSULTATIONS = 'consultations.newConsultations';
    const FOLLOW_UP_CONSULTATIONS = 'consultations.followUpConsultations';
    const FOR_ATTACHMENT_CONSULTATIONS = 'consultations.forAttachmentConsultations';
    const ADDITIONAL_ADVICE_CONSULTATIONS = 'consultations.additionalAdviceConsultations';
    const FOR_PRESCRIPTION_CONSULTATIONS = 'consultations.forPrescriptionConsultations';
    const HOMIS_BINDING_CONSULTATIONS = 'consultations.homisBindingConsultations';
    const UNTRIAGE_CONSULTATIONS = 'consultations.unTriageConsultations';
    const TRIAGED_CONSULTATIONS = 'consultations.triagedConsultations';
    const ASSIGNED_CONSULTATIONS = 'consultations.assignedConsultations';
    const OUT_WHEN_CALLED_CONSULTATIONS = 'consultations.outWhenCalledConsultations';
    const ACTIVE_CONSULTATIONS = 'consultations.activeConsultations';
    const COMPLETED_CONSULTATIONS = 'consultations.completedConsultations';

    const TELEMEDICINE_DOCTORS = 'telemedicines.doctors';
    const TELEMEDICINE_NEW_DOCTORS = 'telemedicines.new_doctor';

    const USER_LIST = 'users.index';
    const USER_CREATE = 'users.store';
    const USER_UPDATE = 'users.update';
    const USER_DELETE = 'users.destroy';

    const ROLE_LIST = 'roles.index';
    const ROLE_CREATE = 'roles.store';
    const ROLE_UPDATE = 'roles.update';
    const ROLE_DELETE = 'roles.destroy';

    const DEPARTMENT_LIST = 'departments.index';
    const DEPARTMENT_CREATE = 'departments.store';
    const DEPARTMENT_UPDATE = 'departments.update';
    const DEPARTMENT_DELETE = 'departments.destroy';
}