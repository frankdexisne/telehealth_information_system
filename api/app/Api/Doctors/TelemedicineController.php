<?php

namespace App\Api\Doctors;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\TeleMedicineDoctor;

class TelemedicineController extends ApiController
{
    public function __construct(TeleMedicineDoctor $telemedicineDoctor) {
        $this->modelQuery = $telemedicineDoctor->query();
        $this->model = $telemedicineDoctor;
    }

    // protected function searchHandler($query, Request $request) {
    //     $name = $request->has('name') ? $request->name : null;
    //     $facility = $request->has('facility') ? $request->facility : null;

    //     $query->when($name, function($query) use($name) {
    //         $query->where('doctor_name', 'LIKE', $name . '%');
    //     })->when($facility, function($query) use($facility) {
    //         $query->where('facility', 'LIKE', $facility . '%');
    //     });
    // }
}
