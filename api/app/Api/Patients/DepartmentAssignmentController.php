<?php

namespace App\Api\Patients;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{DepartmentAssignment, Encounter, Department};
use App\Http\Requests\DepartmentAssignmentRequest;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\WebSocketTrait;

class DepartmentAssignmentController extends ApiController
{
    public function assignDepartment(ConsultationRequest $request, Encounter $encounter) {
        $encounter->departmentAssignment()->create($request->validated());
        $patientName = $encounter->patientChiefComplaint->patientProfile->name;
        $departmentName = Department::find($request->department_id)->name;
        $this->sendEvent('triaged', 'Triaged', $patientName . ' is already triaged to ' . $departmentName);
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function assignToDoctor(DepartmentAssignment $departmentAssignment) {
        $departmentAssignment->update([
            'doctor_id' => auth()->id()
        ]);
        $patientName = $departmentAssignment->encounter->patientChiefComplaint->patientProfile->name;
        $this->sendEvent('assigned', 'Assigned', $patientName . ' is already assigned to ' . auth()->user()->name);
        return $this->success([], Response::HTTP_NO_CONTENT);
    }
}
