<?php
use App\Enums\Role;
Route::controller(App\Api\Teleclerk\TeleclerkLogController::class)
->prefix('/teleclerk-logs')
->name('teleclerk-logs.')
->middleware(['auth:sanctum', 'role:' . Role::TELECLERK . '|' . Role::ADMINISTRATOR])
->group(function() {
    Route::get('/', 'index')
    ->name('index');

    Route::post('/', 'store')
    ->name('store');

    Route::put('/{teleclerkLog}', 'update')
    ->name('update');

    Route::delete('/{teleclerkLog}', 'destroy')
    ->name('destroy');
});