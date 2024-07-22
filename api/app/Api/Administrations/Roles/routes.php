<?php
use App\Enums\Permission;

Route::controller(App\Api\Administrations\Roles\RoleController::class)
->prefix('/roles')
->name('roles.')
->middleware(['auth:sanctum'])
->group(function() {
    Route::get('/', 'index')
    ->middleware('permission:' . Permission::ROLE_LIST)
    ->name('index');

    Route::post('/', 'store')
    ->middleware('permission:' . Permission::ROLE_CREATE)
    ->name('store');

    Route::put('/{role}', 'update')
    ->middleware('permission:' . Permission::ROLE_UPDATE)
    ->name('update');

    Route::get('/{role}/get', 'get')
    // ->middleware('permission:' . Permission::ROLE_UPDATE)
    ->name('show');

    Route::delete('/{role}', 'destroy')
    ->middleware('permission:' . Permission::ROLE_DELETE)
    ->name('destroy');

    Route::get('/permission-lists', 'permissionList')
    // ->middleware('permissions:' . Permission::ROLE_CREATE . '|' . Permission::ROLE_UPDATE)
    ->name('permissionList');

});