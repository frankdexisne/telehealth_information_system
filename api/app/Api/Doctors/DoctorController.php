<?php

namespace App\Api\Doctors;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Enums\{Permission, ApiErrorCode};
use Symfony\Component\HttpFoundation\Response;
use DB;
use App\Models\{Encounter, PatientChiefComplaint, PatientConsultation, DepartmentAssignment, PatientSchedule};

class DoctorController extends ApiController
{

    public function newConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        $filterDate = $request->has('date') ? $request->date : null;

        return Encounter::where('encounters.is_active', 1)
        ->join('department_assignments', function($join) {
            $join->on('encounters.id', '=', 'department_assignments.encounter_id')
            ->where('department_assignments.department_id', auth()->user()->department_id);
        })
        ->whereDoesntHave('consultationAssignment')
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->when($filterDate, function($query) use($filterDate) {
            $query->whereDate('call_logs.created_at', $filterDate);
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('call_logs', 'encounters.call_log_id', 'call_logs.id')
        ->join('users', 'call_logs.user_id', '=', 'users.id')
        ->select(
            'encounters.*', 
            'patient_chief_complaints.chief_complaint',
            DB::raw("CONCAT(patient_profiles.lname, ', ', patient_profiles.fname, ' ', patient_profiles.mname) AS patient_profile_name"),
            'patient_profiles.gender', 
            'patient_profiles.dob', 
            'patient_profiles.contact_no',
            'call_logs.transaction_code', 
            'users.name AS teleclerk'
        )
        ->orderBy('encounters.created_at', "DESC")
        ->paginate($pageSize);
    }

    public function unFinishedConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return Encounter::where('encounters.is_active', 1)
        ->join('department_assignments', function($join) {
            $join->on('encounters.id', '=', 'department_assignments.encounter_id')
            ->where('department_assignments.department_id', auth()->user()->department_id);
        })
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->join('consultation_assignments', function($join) {
            $join->on('encounters.id', '=', 'consultation_assignments.encounter_id')
            ->where('consultation_assignments.doctor_id', auth()->id());
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('call_logs', 'encounters.call_log_id', 'call_logs.id')
        ->join('users', 'consultation_assignments.doctor_id', '=', 'users.id')
        ->select(
            'encounters.*', 
            'patient_chief_complaints.chief_complaint',
            DB::raw("CONCAT(patient_profiles.lname, ', ', patient_profiles.fname, ' ', patient_profiles.mname) AS patient_profile_name"),
            'patient_profiles.gender', 
            'patient_profiles.dob', 
            'patient_profiles.contact_no',
            'call_logs.transaction_code', 
            'users.name AS doctor'
        )
        ->orderBy('encounters.created_at', "DESC")
        ->paginate($pageSize);
    }

    public function consultationFollowUp(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return Encounter::where('encounters.is_active', 1)
        ->where('is_follow_up', 1)
        ->join('department_assignments', function($join) {
            $join->on('encounters.id', '=', 'department_assignments.encounter_id')
            ->where('department_assignments.department_id', auth()->user()->department_id);
        })
        ->whereDoesntHave('consultationAssignment', function($query) {
            $query->where('doctor_id', auth()->id());
        })
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('call_logs', 'encounters.call_log_id', 'call_logs.id')
        ->join('users', 'call_logs.user_id', '=', 'users.id')
        ->select(
            'encounters.*', 
            'patient_chief_complaints.chief_complaint',
            DB::raw("CONCAT(patient_profiles.lname, ', ', patient_profiles.fname, ' ', patient_profiles.mname) AS patient_profile_name"),
            'patient_profiles.gender', 
            'patient_profiles.dob', 
            'patient_profiles.contact_no',
            'call_logs.transaction_code', 
            'users.name AS teleclerk'
        )
        ->orderBy('encounters.created_at', "DESC")
        ->paginate($pageSize);
    }


    public function oldConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        
        return PatientChiefComplaint::where('is_locked', 0)
        ->with('callLog.platform', 'patientProfile', 'departmentAssignment.department', 'consultationAssignment')
        ->whereHas('patientConsultation')
        ->patientCaller()
        ->patientConsultation()
        ->patientSearch($request)
        ->orderBy('created_by', 'DESC')
        ->paginate($pageSize);
    }

    public function activeConsultations(Request $request) {        
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return Encounter::where('encounters.is_active', 1)
        ->where('is_follow_up', 0)
        ->join('department_assignments', function($join) {
            $join->on('encounters.id', '=', 'department_assignments.encounter_id')
            ->where('department_assignments.department_id', auth()->user()->department_id);
        })
        ->join('consultation_assignments', function($join) {
            $join->on('encounters.id', '=', 'consultation_assignments.encounter_id')
            ->where('consultation_assignments.doctor_id', auth()->id());
        })
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('call_logs', 'encounters.call_log_id', 'call_logs.id')
        ->join('users', 'consultation_assignments.doctor_id', '=', 'users.id')
        ->select(
            'encounters.*', 
            'patient_chief_complaints.chief_complaint',
            DB::raw("CONCAT(patient_profiles.lname, ', ', patient_profiles.fname, ' ', patient_profiles.mname) AS patient_profile_name"),
            'patient_profiles.gender', 
            'patient_profiles.dob', 
            'patient_profiles.contact_no',
            'call_logs.transaction_code', 
            'users.name AS doctor'
        )
        ->orderBy('encounters.created_at', "DESC")
        ->paginate($pageSize);
    }

    public function completedConsultations(Request $request) {
        
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return Encounter::where('encounters.is_active', 0)
        ->join('department_assignments', function($join) {
            $join->on('encounters.id', '=', 'department_assignments.encounter_id')
            ->where('department_assignments.department_id', auth()->user()->department_id);
        })
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->join('consultation_assignments', function($join) {
            $join->on('encounters.id', '=', 'consultation_assignments.encounter_id')
            ->where('consultation_assignments.doctor_id', auth()->id());
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('call_logs', 'encounters.call_log_id', 'call_logs.id')
        ->join('users', 'consultation_assignments.doctor_id', '=', 'users.id')
        ->select(
            'encounters.*', 
            'patient_chief_complaints.chief_complaint',
            DB::raw("CONCAT(patient_profiles.lname, ', ', patient_profiles.fname, ' ', patient_profiles.mname) AS patient_profile_name"),
            'patient_profiles.gender', 
            'patient_profiles.dob', 
            'patient_profiles.contact_no',
            'call_logs.transaction_code', 
            'users.name AS doctor'
        )
        ->orderBy('encounters.created_at', "DESC")
        ->paginate($pageSize);
    }

    public function getSchedules(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return PatientSchedule::where('user_id', auth()->id())
        ->join('patient_profiles', 'patient_schedules.patient_profile_id', '=', 'patient_profiles.id')
        ->select(
            'patient_schedules.*', 
            DB::raw("CONCAT(patient_profiles.fname,' ', patient_profiles.mname,' ',patient_profiles.lname) AS patient_profile_name")
        )
        ->paginate($pageSize);
    }


    public function outWhenCalled(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return Encounter::whereHas('patientConsultation', function($query) {
            $query->where('disposition_id', 10);
        })
        ->join('department_assignments', function($join) {
            $join->on('encounters.id', '=', 'department_assignments.encounter_id')
            ->where('department_assignments.department_id', auth()->user()->department_id);
        })
        ->join('consultation_assignments', function($join) {
            $join->on('encounters.id', '=', 'consultation_assignments.encounter_id')
            ->where('consultation_assignments.doctor_id', auth()->id());
        })
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('call_logs', 'encounters.call_log_id', 'call_logs.id')
        ->join('users', 'consultation_assignments.doctor_id', '=', 'users.id')
        ->select(
            'encounters.*', 
            'patient_chief_complaints.chief_complaint',
            DB::raw("CONCAT(patient_profiles.lname, ', ', patient_profiles.fname, ' ', patient_profiles.mname) AS patient_profile_name"),
            'patient_profiles.gender', 
            'patient_profiles.dob', 
            'patient_profiles.contact_no',
            'call_logs.transaction_code', 
            'users.name AS doctor'
        )
        ->orderBy('encounters.created_at', "DESC")
        ->paginate($pageSize);
    }    
}