<?php
Route::controller(App\Api\Administrations\Services\ServiceController::class)
->prefix('/services')
->name('services.')
->middleware(['auth:sanctum'])
->group(function() {
    Route::get('/', 'index')
    ->name('index');

    // Route::post('/', 'store')
    // ->name('store');

    Route::put('/{service}', 'update')
    ->name('update');

    // Route::delete('/{service}', 'destroy')
    // ->name('destroy');
});