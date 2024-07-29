<?php
Route::controller(App\Api\Auth\AuthController::class)
->prefix('/auth')
->name('auth.')
->group(function() {
    Route::middleware('cors')
    ->post('/login', 'login')
    ->name('login');

    Route::middleware('auth:sanctum')
    ->group(function() {
        Route::put('/change-password', 'changePassword')
        ->name('changePassword');
        Route::get('/user', 'user')
        ->name('user');
        Route::post('/logout', 'logout')
        ->name('logout');
    });
});
