<?php
Route::controller(App\Api\Dashboard\DashboardController::class)
->prefix('/dashboards')
->name('dashboards.')
->middleware(['auth:sanctum'])
->group(function() {
    Route::get('/', 'index')
    ->name('index');
    Route::get('/widget-count', 'widgetCounts')
    ->name('widgetCounts');
    Route::get('/pending-consultations/{department}', 'getPendingConsultations')
    ->name('getPendingConsultations');
    Route::get('/ongoing-consultations/{department}', 'getOngoingConsultations')
    ->name('getOngoingConsultations');
    Route::get('/closed-consultations/{department}', 'getClosedConsultations')
    ->name('getClosedConsultations');
});