<?php 

Route::controller(App\Api\Reports\ReportController::class)
->prefix('/reports')
->name('reports.')
->middleware(['auth:sanctum'])
->group(function() {
    Route::get('/', 'index')
    ->name('index');
    Route::get('/teleserve-status', 'teleserveStatus')
    ->name('teleserveStatus');
});