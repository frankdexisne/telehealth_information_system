<?php

namespace App\Api\Patients;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{PatientProfile, Demographic};
use App\Http\Requests\PatientRequest;
use Symfony\Component\HttpFoundation\Response;

class DemographicController extends ApiController
{
    public function __construct(Demographic $model) {
        $this->modelQuery = $model->query();
        $this->model = $model;
    }

    public function store(PatientRequest $request, PatientProfile $patientProfile) {
        $data = $patientProfile->demographic()->create($request->only('brg', 'ctycode', 'provcode', 'patstr', 'regcode', 'patzip'));
        return $this->success(['data' => $data], Response::HTTP_CREATED);
    }

    public function update(PatientRequest $request, Demographic $demographic) {
        $demographic->update($request->only('brg', 'ctycode', 'provcode', 'patstr', 'regcode', 'patzip'));
        return $this->success([], Response::HTTP_CREATED);
    }
}
