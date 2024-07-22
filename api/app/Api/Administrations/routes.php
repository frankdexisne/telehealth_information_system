<?php
include app_path('Api/Administrations/Users/routes.php');
include app_path('Api/Administrations/Roles/routes.php');
include app_path('Api/Administrations/Departments/routes.php');
include app_path('Api/Administrations/Services/routes.php');

Route::get('/selects/{source}', [App\Api\Administrations\SelectController::class, 'makeSelect'])
->name('administrations.selects');

Route::get('/libraries/select', [App\Api\Administrations\SelectController::class,'getLibraries'])
->name('administrations.getLibraries');

Route::get('/homis/select', [App\Api\Administrations\SelectController::class,'getHomisLibraries'])
->name('administrations.getHomisLibraries');