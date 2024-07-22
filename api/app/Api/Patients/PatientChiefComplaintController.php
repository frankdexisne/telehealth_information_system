<?php

namespace App\Api\Patients;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{Encounter, PatientChiefComplaint, TeleclerkLog, PatientProfile, CallLog, ForwardToHomis, Demographic, TeleservePatient, TeleserveDemographic};
use App\Http\Requests\{PatientChiefComplaintRequest, PatientRequest};
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\{DB, Storage};
use Illuminate\Support\Facades\Response as FacadeResponse;
use App\Models\HOMIS\HEnct;
use App\Traits\{PatientTrait, WebSocketTrait};

class PatientChiefComplaintController extends ApiController
{
    use PatientTrait, WebSocketTrait;

    protected $callLog;

    public function __construct(PatientChiefComplaint $patientChiefComplaint) {
        $this->modelQuery = $patientChiefComplaint->query();
        $this->model = $patientChiefComplaint;
        $this->callLog = new CallLog();
    }

    public function index(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        
        return $this->modelQuery
            ->leftJoin('encounters', function($join) {
                $join->on('patient_chief_complaints.id', '=', 'encounters.patient_chief_complaint_id')
                ->where('encounters.is_active', 1);
            })
            ->when($request, function ($query) use ($request) {
                $this->searchHandler($query, $request);
            })
            ->select('patient_chief_complaints.*', DB::raw('CASE WHEN encounters.id IS NOT NULL THEN 0 ELSE 1 END AS is_locked'))
            ->paginate($pageSize);
    }

    protected function searchHandler($query, Request $request) {
        $patientProfileId = $request->has('patient_profile_id') ? $request->patient_profile_id : null;
        // $gender = $request->has('gender') ? $request->gender : null;

        return $query
        ->when($patientProfileId, function($query) use($patientProfileId) {
            $query->where('patient_profile_id', $patientProfileId);
        });
    }

    public function store(PatientChiefComplaintRequest $request, PatientProfile $patientProfile) {

        Demographic::firstOrNew(['patient_profile_id' => $patientProfile->id])
        ->fill($request->only('brg', 'ctycode', 'provcode', 'patstr', 'regcode', 'patzip'))
        ->save();


        $callLog = $this->callLog->generateCallLog($patientProfile, $request->platform_id);
        $data = $this->model->create(
            [
                'patient_profile_id' => $patientProfile->id,
                'chief_complaint' => $request->chief_complaint,
            ]
        );
            
        $encounter = $data->encounter()->create([
            'is_follow_up' => 0,
            'is_active' => 1,
            'call_log_id' => $callLog->id,
            'patient_condition_id' => $request->patient_condition_id,
            'consultation_status_id' => $request->consultation_status_id
        ]);

        $teleservePatient = TeleservePatient::create([
            'inquiry' => $request->chief_complaint,
            'lname' => $patientProfile->lname,
            'fname' => $patientProfile->fname,
            'mname' => $patientProfile->mname,
            'suffix' => $patientProfile->suffix,
            'contact_no' => $patientProfile->contact_no,
            'patient_profile_id' => $patientProfile->id,
            'hpercode' => $patientProfile->hpercode
        ]);

        $teleserveDemographic = TeleserveDemographic::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'regcode' => $patientProfile->demographic->regcode,
            'provcode' => $patientProfile->demographic->provcode,
            'ctycode' => $patientProfile->demographic->ctycode,
            'patstr' => $patientProfile->demographic->patstr,
        ]);

        TeleclerkLog::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'log_datetime' => $request->log_date . ' ' . $request->log_time,
            'platform_id' => $request->platform_id,
            'informant' => $request->informant,
            'inquiry' => $request->chief_complaint,
            'is_teleconsult' => 1,
            'encounter_id' => $encounter->id
        ]);

        $patientName = $patientProfile->name;
        $this->sendEvent('created', 'New Consultation', $patientName . ' has new consultation encoded');

        return $this->success(['data' => $data], Response::HTTP_CREATED);
    }

    public function update(PatientChiefComplaintRequest $request, PatientChiefComplaint $patientChiefComplaint) {
        $patientChiefComplaint->update($request->validated());
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function show(PatientChiefComplaint $patientChiefComplaint) {
        return $this->success([
            'data' => $patientChiefComplaint,
            'patient_profile' => $patientChiefComplaint->patientProfile,
            'consultation_assignment' => $patientChiefComplaint->consultationAssigment,
            'consultation_attachment' => $patientChiefComplaint->consultationAttachment
        ], Response::HTTP_OK);
    }

    public function destroy(PatientChiefComplaint $patientChiefComplaint) {
        $patientChiefComplaint->delete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function forceDelete(PatientChiefComplaint $patientChiefComplaint) {
        $patientChiefComplaint->forceDelete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function createFollowUp(Request $request, PatientChiefComplaint $patientChiefComplaint) {
        
        Demographic::firstOrNew(['patient_profile_id' => $patientChiefComplaint->patient_profile_id])
        ->fill($request->only('brg', 'ctycode', 'provcode', 'patstr', 'regcode', 'patzip'))
        ->save();

        $callLog = $this->callLog->generateCallLog($patientChiefComplaint->patientProfile, $request->platform_id);
        
        $lastEncounter = $patientChiefComplaint->encounter()->orderBy('created_at', 'DESC')->first();
        $lastDepartmentId = $lastEncounter->departmentAssignment()->department_id;

        $encounter = $patientChiefComplaint->encounter()->create([
            'is_follow_up' => 1,
            'is_active' => 1,
            'call_log_id' => $callLog->id,
            'patient_condition_id' => 1,
            'consultation_status_id' => 1
        ]);

        if ($lastDepartmentId) {
            $encounter->departmentAssignment()->create([
                'department_id' => $lastDepartmentId
            ]);
        }
        
        $patientProfile = $patientChiefComplaint->patientProfile;

        $teleservePatient = TeleservePatient::create([
            'inquiry' => $request->chief_complaint,
            'lname' => $patientProfile->lname,
            'fname' => $patientProfile->fname,
            'mname' => $patientProfile->mname,
            'suffix' => $patientProfile->suffix,
            'contact_no' => $patientProfile->contact_no,
            'patient_profile_id' => $patientProfile->id,
            'hpercode' => $patientProfile->hpercode
        ]);

        $teleserveDemographic = TeleserveDemographic::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'regcode' => $patientProfile->demographic->regcode,
            'provcode' => $patientProfile->demographic->provcode,
            'ctycode' => $patientProfile->demographic->ctycode,
            'patstr' => $patientProfile->demographic->patstr,
        ]);

        TeleclerkLog::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'log_datetime' => $request->log_date . ' ' . $request->log_time,
            'platform_id' => $request->platform_id,
            'informant' => $request->informant,
            'inquiry' => $request->chief_complaint,
            'is_teleconsult' => 1,
            'encounter' => $encounter->id
        ]);

        // TeleclerkLog::create([
        //     'log_datetime' => $request->log_date . ' ' . $request->log_time,
        //     'platform_id' => $request->platform_id,
        //     'informant' => $request->informant,
        //     'inquiry' => $patientChiefComplaint->chief_complaint,
        //     'patient_lname' => $patientProfile->lname,
        //     'patient_fname' => $patientProfile->fname,
        //     'patient_mname' => $patientProfile->mname,
        //     'patient_suffix' => $patientProfile->suffix,
        //     'patient_profile_id' => $patientProfile->id,
        //     'patient_contact_no' => $patientProfile->contact_no,
        //     'regcode' => $patientProfile->demographic->regcode,
        //     'provcode' => $patientProfile->demographic->provcode,
        //     'ctycode' => $patientProfile->demographic->ctycode,
        //     'patstr' => $patientProfile->demographic->patstr,
        //     'is_teleconsult' => 1
        // ]);

        $patientName = $patientProfile->name;
        $this->sendEvent('created', 'Follow-up', $patientName . ' has new follow up consultation');

        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function attachFile(Request $request) {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust validation rules as needed
        ]);

        $uploadedFile = $request->file('file');

        $remoteFilePath =  '/' . $uploadedFile->getClientOriginalName();

        Storage::disk('ftp')->put($remoteFilePath, file_get_contents($uploadedFile->path()));

        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function getAttachments(PatientChiefComplaint $patientChiefComplaint) {
        return $this->success([
            'data' => $patientChiefComplaint->consultationAttachment->pluck('uri')->toArray()
        ], Response::HTTP_OK);
    }

    public function viewAttachment(PatientChiefComplaint $patientChiefComplaint, string $filename) {
        $imagePath = $patientChiefComplaint->id . '/' . $filename;
        $imageData = Storage::disk('patient_chief_complaints')->get($imagePath);

        if ($imageData) {
            $extension = pathinfo($imagePath, PATHINFO_EXTENSION);
            $contentType = 'image/png'; // Default content type
            // Determine content type based on file extension
            if ($extension === 'jpg' || $extension === 'jpeg') {
                $contentType = 'image/jpeg';
            } elseif ($extension === 'png') {
                $contentType = 'image/png';
            } elseif ($extension === 'gif') {
                $contentType = 'image/gif';
            } // Add more conditions as needed for other image types

            // Set the appropriate content type in the response header
            return FacadeResponse::make($imageData, 200, [
                'Content-Type' => $contentType,
                'Content-Disposition' => 'inline; filename="' . $imagePath . '"'
            ]);
        }   else {
            return response()->json(['error' => 'Image not found'], 404);
        }
    }

    public function completingDemographic(PatientRequest $request, Encounter $encounter) {
        $demographic = Demographic::firstOrNew(['patient_profile_id'=> $encounter->patientChiefComplaint->patient_profile_id]);

        if (!$demographic->exists) {
            $demographic->fill($request->only('brg', 'ctycode', 'provcode', 'patstr', 'regcode', 'patzip'))
            ->save();
        }

        $this->migrateProfile($encounter->patientChiefComplaint);
        $patientProfile = PatientProfile::find($encounter->patientChiefComplaint->patient_profile_id);
        Henct::create([
            'hpercode' => $patientProfile->hpercode, 
            'encdate' => $encounter->consultationAssignment->first()->created_at, 
            'enctime' => $encounter->consultationAssignment->first()->created_at
        ]);
        ForwardToHomis::where('encounter_id', $encounter->id)->update(['sent' => 1, 'user_id' => auth()->id()]);
        return $this->success(['data' => $demographic], Response::HTTP_CREATED);
    }

    public function getForwardToHomis(ForwardToHomis $forwardToHomis) {
        $data = $forwardToHomis;
        $encounter = Encounter::find($data->encounter_id);
        $patientChiefComplaint = PatientChiefComplaint::find($encounter->patient_chief_complaint_id);
        return $this->success([
            'data' => $data, 
            'encounter' => $encounter,
            'patient_chief_complaint' => $patientChiefComplaint,
            'patient_profile' => $patientChiefComplaint->patientProfile,
            'demographic' => $patientChiefComplaint->patientProfile->demographic
        ], Response::HTTP_OK);
    }
}
