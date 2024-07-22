<?php
use App\Enums\Permission;
Route::controller(App\Api\Administrations\Users\UserController::class)
->prefix('/users')
->name('users.')
->middleware(['auth:sanctum'])
->group(function() {
    Route::get('/', 'index')
    ->middleware('permission:' . Permission::USER_LIST)
    ->name('index');

    Route::post('/', 'store')
    ->middleware('permission:' . Permission::USER_CREATE)
    ->name('store');

    Route::put('/{user}', 'update')
    ->middleware('permission:' . Permission::USER_UPDATE)
    ->name('update');

    Route::get('/{user}', 'show')
    ->middleware('permission:' . Permission::USER_UPDATE)
    ->name('show');

    Route::delete('/{user}', 'destroy')
    ->middleware('permission:' . Permission::USER_DELETE)
    ->name('destroy');

    Route::put('/{user}/link', 'linkUser')
    ->middleware('permission:' . Permission::USER_UPDATE)
    ->name('linkUser');
});