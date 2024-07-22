<?php
use App\Enums\{Permission, Role};

Route::controller(App\Api\Patients\PatientController::class)
->prefix('/patients')
->name('patients.')
->middleware(['auth:sanctum'])
->group(function() {
    Route::get('/', 'index')
    ->middleware('permission:' . Permission::PATIENT_LIST)
    ->name('index');

    Route::get('/search', 'patientSearch')
    ->middleware('permission:' . Permission::PATIENT_LIST)
    ->name('patientSearch');

    Route::get('/teleserve-search', 'teleservicePatientSearch')
    ->name('teleservicePatientSearch');

    Route::post('/', 'store')
    ->middleware('permission:' . Permission::PATIENT_CREATE)
    ->name('store');

    Route::put('/{patientProfile}', 'update')
    ->middleware('permission:' . Permission::PATIENT_UPDATE)
    ->name('update');

    Route::delete('/{patientProfile}', 'destroy')
    ->middleware('permission:' . Permission::PATIENT_DELETE)
    ->name('destroy');

    Route::get('/{patientProfile}', 'show')
    ->middleware('permission:' . Permission::PATIENT_UPDATE)
    ->name('show');

    Route::post('/search', 'search')
    ->middleware('permission:' . Permission::PATIENT_LIST)
    ->name('search');

    Route::get('/{hpercode}/validate', 'validatingProfile')
    ->middleware('permission:' . Permission::PATIENT_CREATE)
    ->name('validatingProfile');

    Route::post('/{hpercode}/clone-to-telehealth','cloneToTelehealth')
    ->middleware('permission:' . Permission::PATIENT_CREATE)
    ->name('cloneToTelehealth');

    Route::put('/{patientProfile}/{hpercode}/bind','bindToTelehealth')
    ->middleware('permission:' . Permission::PATIENT_CREATE)
    ->name('bindToTelehealth');

    Route::get('/{hpercode}/homis-patient','homisPatient')
    ->name('homisPatient');
});

Route::controller(App\Api\Patients\DemographicController::class)
->prefix('/demographics')
->name('demographics.')
->middleware(['auth:sanctum'])
->group(function() {

    Route::post('/{patientProfile}', 'store')
    ->middleware('permission:' . Permission::PATIENT_LIST)
    ->name('store');

    Route::put('/{demographic}', 'update')
    ->middleware('permission:' . Permission::PATIENT_LIST)
    ->name('update');

});

Route::controller(App\Api\Patients\EncounterController::class)
->prefix('/encounters')
->name('encounters.')
->middleware(['auth:sanctum'])
->group(function() {

    Route::get('/', 'index')
    ->name('index');

    Route::get('/{encounter}', 'show')
    ->name('show');

    Route::put('/{encounter}/assign-consultation', 'assign')
    ->middleware('permission:' . Permission::ENCOUNTER_ASSIGN)
    ->name('assign');

    Route::put('/{encounter}/triage-to-department', 'triageToDepartment')
    ->middleware('permission:' . Permission::ENCOUNTER_TRIAGE_TO_DEPARTMENT)
    ->name('triageToDepartment');

    Route::put('/{encounter}/lock-consultation','lockConsultation')
    ->middleware('role:' . Role::DOCTOR)
    ->name("lockConsultation");

    Route::post('/{encounter}/set-schedule', 'setSchedule')
    ->name('setSchedule');
});

Route::controller(App\Api\Patients\HpersonController::class)
->prefix('/hpersons')
->name('hpersons.')
->middleware('auth:sanctum')
->group(function() {
    Route::get('/', 'index')
    ->middleware('permission:' . Permission::PATIENT_LIST)
    ->name('index');
});

Route::controller(App\Api\Patients\PatientChiefComplaintController::class)
->prefix('/patient-chief-complaints')
->name('patient-chief-complaints.')
->middleware('auth:sanctum')
->group(function() {
    Route::get('/', 'index')
    ->middleware('permission:' . Permission::CHIEF_COMPLAINT_LIST)
    ->name('index');

    Route::post('/{patientProfile}', 'store')
    ->middleware('permission:' . Permission::CHIEF_COMPLAINT_CREATE)
    ->name('store');

    Route::put('/{patientChiefComplaint}', 'update')
    ->name('permission:' . Permission::CHIEF_COMPLAINT_UPDATE)
    ->name('update');

    Route::delete('/{patientChiefComplaint}', 'destroy')
    ->middleware('permission:' . Permission::CHIEF_COMPLAINT_DELETE)
    ->name('destroy');

    Route::get('/{patientChiefComplaint}', 'show')
    ->middleware('permission:' . Permission::CHIEF_COMPLAINT_UPDATE)
    ->name('show');

    Route::post('attach-file', 'attachFile')
    ->name('attachFile');

    Route::get('{patientChiefComplaint}/attachments', 'getAttachments')
    // ->middleware('permission:' . Permission::PATIENT_ATTACHMENT)
    ->name('getAttachments');

    Route::get('/{patientChiefComplaint}/{filename}', 'viewAttachment')
    // ->middleware('permission:' . Permission::CHIEF_COMPLAINT_UPDATE)
    ->name('viewAttachment');

    Route::put('/{patientChiefComplaint}/follow-up', 'createFollowUp')
    ->middleware('permission:' . Permission::CHIEF_COMPLAINT_UPDATE)
    ->name('createFollowUp');

    Route::get('/{forwardToHomis}/telehealth-data/forward-to-homis', 'getForwardToHomis')
    ->name('getForwardToHomis');

    Route::post('/{encounter}/completing-data/demographic', 'completingDemographic')
    ->middleware('permission:' . Permission::PATIENT_UPDATE)
    ->name('completingDemographic');

});


// Route::controller(App\Api\Patients\DepartmentAssignmentController::class)
// ->prefix('/department-assignments')
// ->name('department-assignments.')
// ->middleware('auth:sanctum')
// ->group(function() {
//     Route::put('/{patientChiefComplaint}', 'assignDepartment')
//     ->middleware('permission:' . Permission::ASSIGN_DEPARTMENT)
//     ->name('assignDepartment');

//     Route::put('/{departmentAssignment}/assign-doctor', 'assignToDoctor')
//     ->middleware('permission:' . Permission::ASSIGN_DOCTOR)
//     ->name('assignToDoctor');
// });

Route::controller(App\Api\Patients\ConsultationController::class)
->prefix('/consultations')
->name('consultations.')
->middleware('auth:sanctum')
->group(function() {
    Route::get('/new-consultations', 'newConsultations')    
    ->middleware('permission:' . Permission::NEW_CONSULTATIONS)
    ->name('newConsultations');

    Route::get('/follow-up-consultations', 'followUpConsultations')
    ->middleware('permission:' . Permission::FOLLOW_UP_CONSULTATIONS)
    ->name('followUpConsultations');

    Route::get('/for-attachment-consultations', 'forAttachmentConsultations')
    ->middleware('permission:' . Permission::FOR_ATTACHMENT_CONSULTATIONS)
    ->name('forAttachmentConsultations');

    Route::get('/additional-advice-consultations', 'additionalAdviceConsultations')
    ->middleware('permission:' . Permission::ADDITIONAL_ADVICE_CONSULTATIONS)
    ->name('additionalAdviceConsultations');

    Route::get('/for-prescription-consultations', 'forPrescriptionConsultations')
    ->middleware('permission:' . Permission::FOR_PRESCRIPTION_CONSULTATIONS)
    ->name('forPrescriptionConsultations');

    Route::get('/un-triage-consultations','unTriageConsultation')
    ->middleware('permission:' . Permission::UNTRIAGE_CONSULTATIONS)
    ->name('unTriageConsultation');

    Route::get('/triaged-consultations', 'triagedConsultation')
    ->middleware('permission:' . Permission::TRIAGED_CONSULTATIONS)
    ->name('triagedConsultation');

    Route::get('/assigned-consultations', 'assignedConsultation')
    ->middleware('permission:' . Permission::ASSIGNED_CONSULTATIONS)
    ->name('assignedConsultation');

    Route::get('/out-when-called-consultations', 'outWhenCalledConsultations')
    ->middleware('permission:' . Permission::OUT_WHEN_CALLED_CONSULTATIONS)
    ->name('outWhenCalled');

     Route::get('/active-consultations', 'activeConsultations')
    ->middleware('permission:' . Permission::ACTIVE_CONSULTATIONS)
    ->name('activeConsultations');

    Route::get('/completed-consultations', 'completedConsultations')
    ->middleware('permission:' . Permission::COMPLETED_CONSULTATIONS)
    ->name('completedConsultations');

    Route::get('/forward-to-homis', 'forwardToHomis')
    ->middleware('permission:' . Permission::HOMIS_BINDING_CONSULTATIONS)
    ->name('forwardToHomis');

});

Route::controller(App\Api\Patients\PatientScheduleController::class)
->prefix('/patient-schedules')
->name('patient-schedules.')
->middleware('auth:sanctum')
->group(function() {
    Route::get('/', 'index')
    // ->middleware('permission:' . Permission::PATIENT_SCHEDULE_LIST)
    ->name('index');

    Route::get('/get-departments-by-month', 'getDepartmentsByMonth')
    ->name('getDepartmentsByMonth');

    Route::get('/department-patients/by-schedule-date', 'getDepartmentPatientsByScheduleDate')
    ->name('getDepartmentPatientsByScheduleDate');

     Route::post('/get-scheduled-dates-by-department-and-month', 'getScheduledDatesByDepartmentAndMonth')
    ->name('getScheduledDatesByDepartmentAndMonth');

    Route::get('/get-schedules', 'getSchedules')
    ->name('getSchedules');

    Route::get('/get-calendar-schedules', 'getCalendarSchedule')
    ->name('getCalendarSchedule');

    Route::get('/get-patient-schedules', 'getDailyPatientSchedules')
    ->name('getDailyPatientSchedules');

    Route::get('/get-department-patient-schedules', 'getDepartmentPatientSchedules')
    ->name('getDepartmentPatientSchedules');

    Route::get('/{patientSchedule}', 'update')
    ->name('update');

    Route::delete('/{patientSchedule}', 'destroy')
    ->middleware('permission:' . Permission::PATIENT_SCHEDULE_DELETE)
    ->name('destroy');

    Route::get('/reffered/to-opd', 'dailyPatientScheduleList')
    ->name('dailyPatientScheduleList');

    Route::get('/{department}/{month}', 'dailyDepartmentSchedule')
    ->name('dailyDepartmentSchedule');

    

   

    
});