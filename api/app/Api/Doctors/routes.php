<?php
use App\Enums\{Permission, Role};

Route::controller(App\Api\Doctors\DoctorController::class)
->prefix('/doctors')
->name('doctors.')
->middleware(['auth:sanctum'])
->group(function() {
    
    Route::get('/new-consultations', 'newConsultations')
    ->middleware('permission:' . Permission::DOCTOR_NEW_CONSULTATIONS)
    ->name('newConsultations');

    Route::get('/unfinish-consultations', 'unFinishedConsultations')
    ->middleware('permission:' . Permission::DOCTOR_UNFINISH_CONSULTATIONS)
    ->name('unFinishedConsultations');

    Route::get('/follow-up-consultations', 'consultationFollowUp')
    ->middleware('permission:' . Permission::DOCTOR_FOLLOW_UP_CONSULTATIONS)
    ->name('consultationFollowUp');

    Route::get('/active-consultations', 'activeConsultations')
    ->middleware('permission:' . Permission::DOCTOR_ACTIVE_CONSULTATIONS)
    ->name('activeConsultations');

    Route::get('/completed-consultations', 'completedConsultations')
    ->middleware('permission:' . Permission::DOCTOR_COMPLETED_CONSULTATIONS)
    ->name('completedConsultations');

    Route::get('/schedules', 'getSchedules')
    ->name('getSchedules');

     Route::get('/out-when-called', 'outWhenCalled')
    ->middleware('permission:' . Permission::DOCTOR_OUT_WHEN_CALLED_CONSULTATIONS)
    ->name('outWhenCalled');

    
});

Route::controller(App\Api\Doctors\PatientConsultationController::class)
->prefix('/patient-consultations')
->name('patient-consultations.')
->middleware(['auth:sanctum', 'role:' . Role::DOCTOR])
->group(function() {
    Route::get('/', 'index')
    ->name('index');

    Route::post('/{encounter}', 'store')
    ->name('store');

    Route::put('/{patientConsultation}', 'update')
    ->name('update');

    Route::delete('/{patientConsultation}', 'destroy')
    ->name('destroy');

    Route::put('/{encounter}/provide-prescription', 'providePrescription')
    ->name('providePrescription');

    Route::put('/{encounter}/create-schedule', 'createSchedule')
    ->name('createSchedule');

    Route::put('/{encounter}/transfer-department', 'transferDepartment')
    ->name('transferDepartment');

    Route::put('/{encounter}/co-manage-department', 'comanageDepartment')
    ->name('comanageDepartment');

    Route::put('/{encounter}/confirm-no-signal', 'confirmTelehealthPhoneNoSignal')
    ->name('confirmTelehealthPhoneNoSignal');

});

Route::controller(App\Api\Doctors\DoctorController::class)
->prefix('/telemedicine-doctors')
->name('telemedicine-doctors.')
// ->middleware(['auth:sanctum','role:doctor'])
->group(function() {
    Route::get('/', 'index')
    // ->middleware('permission:' . Permission::TELEMEDICINE_DOCTORS)
    ->name('index');

    Route::post('/', 'store')
    // ->middleware('permission:' . Permission::TELEMEDICINE_NEW_DOCTORS)
    ->name('store');
});