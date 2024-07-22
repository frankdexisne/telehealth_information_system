<?php
use App\Enums\Permission;

Route::controller(App\Api\Administrations\Departments\DepartmentController::class)
->prefix('/departments')
->name('departments.')
->middleware(['auth:sanctum'])
->group(function() {
    Route::get('/', 'index')
    ->middleware('permission:' . Permission::DEPARTMENT_LIST)
    ->name('index');

    Route::post('/', 'store')
    ->middleware('permission:' . Permission::DEPARTMENT_CREATE)
    ->name('store');

    Route::put('/{department}', 'update')
    ->middleware('permission:' . Permission::DEPARTMENT_UPDATE)
    ->name('update');

    Route::delete('/{department}', 'destroy')
    ->name('permission:' . Permission::DEPARTMENT_DELETE)
    ->name('destroy');
});