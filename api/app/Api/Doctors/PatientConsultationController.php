<?php

namespace App\Api\Doctors;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{ PatientChiefComplaint, ConsultationAssignment, Department, Encounter, PatientConsultation, PatientSchedule, DepartmentAssignment};
use Symfony\Component\HttpFoundation\Response;

class PatientConsultationController extends ApiController
{
    public function __construct(PatientConsultation $patientConsultation) {
        $this->modelQuery = $patientConsultation->query();
        $this->model = $patientConsultation;
    }

    public function index(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 5;
        $encounterId = $request->has('encounter_id') ? $request->encounter_id : null;
        
        return $this->modelQuery
            ->where('encounter_id', $encounterId)
            ->leftJoin("users", 'patient_consultations.doctor_id', '=', 'users.id')
            ->leftJoin('departments', 'users.department_id', 'departments.id')
            ->select('patient_consultations.*', 'users.name AS doctor', 'departments.name AS department_name')
            ->when($request, function ($query) use ($request) {
                $this->searchHandler($query, $request);
            })
            ->paginate($pageSize);
    }

    public function store(Request $request, Encounter $encounter) {
        $data = $encounter->patientConsultation()->create($request->only('disposition_id', 'findings'));
        return $this->success(['data' => $data], Response::HTTP_CREATED);
    }

    public function update(Request $request, PatientConsultation $patientConsultation) {
        $patientConsultation->update($request->only('findings'));
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function destroy(PatientConsultation $patientConsultation) {
        $patientConsultation->delete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function providePrescription(Request $request, Encounter $encounter){
        $this->createPatientConsultation($encounter, 3, 'Prescription Given');
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function createSchedule(Request $request, Encounter $encounter) {
        $encounter->patientChiefComplaint->patientProfile->patientSchedule()->create([
            'user_id' => auth()->id(),
            'schedule_status_id' => 1, // SCHEDULED FROM SCHEDULE_STATUS
            'reason' => $request->reason,
            'schedule_date' => $request->schedule_date,
            'schedule_time' => $request->schedule_time,
            'status' => ''
        ]);

        $notes = now()->format("F d, Y h:i:s A") . " ," . $request->reason;

        $this->createPatientConsultation($encounter, 5, $notes);

        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function transferDepartment(Request $request, Encounter $encounter) {
        $departmentAssignment = DepartmentAssignment::firstOrNew([
            'department_id' => $request->department_id,
            'encounter_id' => $encounter->id
        ]);

        if (!$departmentAssignment->exists) {
            $departmentAssignment->fill([
                'doctor_id' => auth()->id()
            ])
            ->save();

            $department = Department::find($departmentAssignment->department_id);
            $notes = "Transfered: " . $department->name;

            $this->setInactiveConsultationAssignment(auth()->id(), $encounter->id);

            $this->createPatientConsultation($encounter, 8, $notes);

            DepartmentAssignment::where([
                'department_id' => auth()->user()->department_id,
                'encounter_id' => $encounter->id
            ])
            ->update([
                'completed_at' => now()->format("Y-m-d H:i:s")
            ]);
        }

        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function comanageDepartment(Request $request, Encounter $encounter) {
        $departmentAssignment = DepartmentAssignment::firstOrNew([
            'department_id' => $request->department_id,
            'encounter_id' => $encounter->id
        ]);

        if (!$departmentAssignment->exists) {
            $departmentAssignment->fill([
                'doctor_id' => auth()->id()
            ])
            ->save();
            
            $department = Department::find($departmentAssignment->department_id);
            $notes = "Co-manage: " . $department->name;

            $this->setInactiveConsultationAssignment(auth()->id(), $encounter->id);

            $this->createPatientConsultation($encounter, 9, $notes);
        }
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    protected function setInactiveConsultationAssignment(int $doctorId, int $encounterId) {
        ConsultationAssignment::where([
                'doctor_id' => $doctorId,
                'encounter_id' => $encounterId
            ])
            ->update(['is_active' => 0]);
    }

    protected function createPatientConsultation(Encounter $encounter, int $dispositionId, string $notes) {
        $encounter->patientConsultation()->create([
            'doctor_id' => auth()->id(),
            'disposition_id' => $dispositionId,
            'findings' => $notes,
            'findings_date' => now()->format('Y-m-d h:i:s A')
        ]);
    }

    public function confirmTelehealthPhoneNoSignal(Request $request, Encounter $encounter) {
        $this->createPatientConsultation($encounter, 12, "Service Phone is no signal");
        return $this->success([], Response::HTTP_NO_CONTENT);
    }
}
