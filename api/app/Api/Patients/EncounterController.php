<?php

namespace App\Api\Patients;

use App\Http\Controllers\ApiController;
use App\Enums\{ApiErrorCode};
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\{Encounter, PatientChiefComplaint, Demographic, Department, DepartmentAssignment, TeleclerkLog};
use App\Models\HOMIS\{Hperson};
use App\Traits\{PatientTrait, WebSocketTrait};

class EncounterController extends ApiController
{
    use PatientTrait, WebSocketTrait;

    public function __construct(Encounter $encounter) {
        $this->modelQuery = $encounter->query();
        $this->model = $encounter;
    }   

    public function index(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        
        return $this->modelQuery
            ->when($request, function ($query) use ($request) {
                $this->searchHandler($query, $request);
            })
            ->join('patient_chief_complaints', function($query) use($request) {
                $query->on('encounters.patient_chief_complaint_id', '=', 'patient_chief_complaints.id')
                ->where('patient_chief_complaints.patient_profile_id', $request->patient_profile_id);
            })
            ->leftJoin('patient_schedules', 'encounters.id', '=', 'patient_schedules.encounter_id')
            ->select('encounters.*', 'patient_chief_complaints.chief_complaint', 'schedule_datetime')
            ->orderBy('created_at', 'DESC')
            ->paginate($pageSize);
    }

    public function show(Encounter $encounter) {
        $patientChiefComplaint = $encounter->patientChiefComplaint;

        return $this->success([
            'data' => $encounter,
            'patient_chief_complaint' => $patientChiefComplaint,
            'patient_profile' => $patientChiefComplaint->patientProfile,
            'department_assignment' => $encounter->departmentAssignment,
            'consultation_assignment' => $encounter->consultationAssigment,
            'consultation_attachment' => $encounter->consultationAttachment,
            'patient_consultations' => $encounter->patientConsultation
        ], Response::HTTP_OK);
    }

    public function assign(Encounter $encounter) {
        $departmentAssignment = $encounter->departmentAssignment()->orderBy('created_at', 'DESC')->first();

        if ($departmentAssignment) {
            DepartmentAssignment::find($departmentAssignment->id)
            ->update([
                'accomodated_at' => now()->format("Y-m-d H:i:s")
            ]);
        }

        $encounter->consultationAssignment()->create([
            'doctor_id' => auth()->id(),
            'user_id' => auth()->id(),
        ]);

        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function triageToDepartment(Request $request, Encounter $encounter) {
        if ($encounter->departmentAssignment()->count() > 0) {
            return $this->error("Already assigned to department", 422, ApiErrorCode::VALIDATION);
        }

        $encounter->departmentAssignment()->create([
            'department_id' => $request->department_id,
            'doctor_id' => auth()->id()
        ]);

        $teleclerkLog = TeleclerkLog::where('encounter_id', $encounter->id);

        if ($teleclerkLog->count() > 0) {
            $teleclerkLog->update([
                'department_id' => $request->department_id
            ]);
        }


        $patientName = $encounter->patientChiefComplaint->patientProfile->name;
        $departmentName = Department::find($request->department_id)->name;
        $this->sendEvent('triaged', 'Triaged', $patientName . ' is already triaged to ' . $departmentName);

        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function lockConsultation(Encounter $encounter) {

        // $this->rollBack(function() use($encounter) {
            $encounter->update([
                'is_active' => 0
            ]);

            $isContactedPatient = $encounter->patientConsultation()->whereIn('disposition_id', [10, 12])->count() == 0 ? true : false;

            if($isContactedPatient) {
                $patientProfile = $encounter->patientChiefComplaint->patientProfile;
                if (!$encounter->patientChiefComplaint->patientProfile->hpercode) {
                    $encounter->forwardToHomis()->create();
                } else {
                    $noMatchFound = Hperson::where('patlast', 'LIKE', substr($patientProfile->lname, 0, 3) . "%")
                    ->where('patfirst', 'LIKE', substr($patientProfile->fname, 0, 3) . "%")
                    ->where('patmiddle', 'LIKE', substr($patientProfile->mname, 0, 3) . "%")
                    ->count() == 0 ? true : false;

                    $hasDemographic = Demographic::where('patient_profile_id', $patientProfile->id)->count() == 1;

                    if ($noMatchFound && $hasDemographic) {
                        $this->migrateProfile($encounter->patientChiefComplaint);
                    } else {
                        HEnct::create(['hpercode' => $patientChiefComplaint->patientProfile->hpercode]);
                    }
                }
            }

            $patientName = $encounter->patientChiefComplaint->patientProfile->name;
            $this->sendEvent('locked', 'Completed', $patientName . ' is already completed his/her consultation');
        // });
        
        return $this->success(['encounter' => $encounter], Response::HTTP_OK);
    }

    public function setSchedule(Request $request, Encounter $encounter) {
        $patientSchedule = $encounter->patientSchedule()->create([
            'patient_profile_id' => $encounter->patientChiefComplaint->patient_profile_id,
            'user_id' => auth()->id(),
            'schedule_status_id' => 1,
            'reason' => 'FACE TO FACE SCHEDULE',
            'schedule_datetime' => date('Y-m-d H:i:s',strtotime($request->schedule_datetime)),
        ]);

        return $this->success(['patientSchedule' => $patientSchedule], Response::HTTP_OK);
    }
}
