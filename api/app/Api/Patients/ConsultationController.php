<?php

namespace App\Api\Patients;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{Encounter, PatientChiefComplaint, CallLog, ConsultationFollowUp, ConsultationAdditionalAdvice, ConsultationAssignment,PatientConsultation, DepartmentAssignment, ForwardToHomis};
use App\Http\Requests\ConsultationRequest;
use DB;

class ConsultationController extends ApiController
{
    public function newConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        $filterDate = $request->has('date') ? $request->date : null;
        $teleclerk = $request->has('teleclerk') ? $request->teleclerk : null;
        return Encounter::where('is_follow_up', 0)
        ->where('encounters.is_active', 1)
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->when($filterDate, function($query) use($filterDate) {
            $query->whereDate('call_logs.created_at', $filterDate);
        })
        ->when($teleclerk, function($query) use($teleclerk) {
            $query->where('call_logs.user_id', $teleclerk);
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

    public function followUpConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        $teleclerk = $request->has('teleclerk') ? $request->teleclerk : null;
        return Encounter::where('is_follow_up', 0)
        ->where('encounters.is_active', 1)
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->when($teleclerk, function($query) use($teleclerk) {
            $query->where('call_logs.user_id', $teleclerk);
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
    
    public function forAttachmentConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return Encounter::where('encounters.is_active', 1)
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

    public function additionalAdviceConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        
        return ConsultationAdditionalAdvice::join('patient_consultations','patient_consultations.id', '=', 'consultation_additional_advice.patient_consultation_id')
        ->join('encounters', 'patient_consultations.encounter_id', '=', 'encounters.id')
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', '=', 'patient_chief_complaints.id')
        ->join('patient_profiles', function($join) use($request) {
            $name = $request->has('name') ? $request->name : null;
            $join->on('patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
            ->when($name, function($query) use($name) {
                $query->where(function($query) use($request) {
                    $query->where('lname', 'LIKE', $request->name . '%')
                    ->orWhere('fname', 'LIKE', $request->name . '%')
                    ->orWhere('mname', 'LIKE', $request->name . '%');
                });
            });
        })
        ->join('users', 'patient_consultations.doctor_id', '=', 'users.id')
        ->join('departments', 'users.department_id', '=', 'departments.id')
        ->select(
            'consultation_additional_advice.*', 
            DB::raw("CONCAT(patient_profiles.lname, ', ', patient_profiles.fname, ' ', patient_profiles.mname) AS patient_profile_name"),
            'patient_consultations.findings',
            'patient_chief_complaints.chief_complaint', 
            'patient_consultations.findings',
            'users.name AS doctor', 
            'departments.name AS department'
        )
        ->paginate($pageSize);
    }

    public function forPrescriptionConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return Encounter::where('encounters.is_active', 1)
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('call_logs', 'encounters.call_log_id', 'call_logs.id')
        ->join('department_assignments', 'department_assignments.encounter_id', '=', 'encounters.id')
        ->join('departments', 'department_assignments.department_id', '=', 'departments.id')
        ->join('consultation_assignments', 'consultation_assignments.encounter_id', 'encounters.id')
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

    public function outWhenCalledConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return PatientConsultation::where('disposition_id', 10)
        ->join('encounters', 'patient_consultations.encounter_id', '=', 'encounters.id')
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', '=', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('users', 'patient_consultations.doctor_id', '=', 'users.id')
        ->join('departments', 'users.department_id', '=', 'departments.id')
        ->orderBy('patient_chief_complaints.created_at', 'DESC')
        ->select(
            'patient_consultations.*', 
            'patient_chief_complaints.chief_complaint',
            DB::raw("CONCAT(patient_profiles.fname,' ', patient_profiles.mname,' ',patient_profiles.lname) AS patient_profile_name"),
            'patient_profiles.contact_no',
            'patient_profiles.gender',
            DB::raw("TIMESTAMPDIFF(YEAR,patient_profiles.dob, CURDATE()) AS age"),
            'is_pregnant',
            'users.name AS doctor',
            'patient_profiles.dob',
        )
        ->paginate($pageSize);
    }

    public function unTriageConsultation(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return Encounter::where('encounters.is_active', 1)
        ->whereDoesntHave('departmentAssignment')
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
        )
        ->orderBy('encounters.created_at', "DESC")
        ->paginate($pageSize);
    }

    public function triagedConsultation(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return Encounter::where('encounters.is_active', 1)
        ->whereHas('departmentAssignment')
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

    public function activeConsultations(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        $teleclerk = $request->has('teleclerk') ? $request->teleclerk : null;

        return Encounter::where('encounters.is_active', 1)
        ->whereHas('departmentAssignment')
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('department_assignments', 'encounters.id', '=', 'department_assignments.encounter_id')
        ->join('departments', 'department_assignments.department_id', '=', 'departments.id')
        ->join('consultation_assignments', 'encounters.id', '=', 'consultation_assignments.encounter_id')
        ->join('users', 'consultation_assignments.doctor_id', '=', 'users.id')
        ->join('call_logs', 'encounters.call_log_id', '=', 'call_logs.id')
        ->select(
            'encounters.*', 
            'patient_chief_complaints.chief_complaint',
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
        $doctor = $request->has('doctor') ? $request->doctor : null;

        return Encounter::where('encounters.is_active', 0)
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->when($doctor, function($query) use($doctor) {
            $query->where('consultation_assignments.doctor_id', $doctor);
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('call_logs', 'encounters.call_log_id', 'call_logs.id')
        ->join('consultation_assignments', 'encounters.id', '=', 'consultation_assignments.encounter_id')
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

    public function assignedConsultation(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        $department = $request->has('department') ? $request->department : null;

        return Encounter::where('encounters.is_active', 1)
        ->patientCaller()
        ->whereHas('patientChiefComplaint', function($query) use($request) {
            $query->patientSearch($request);
        })
        ->when($department, function($query) use($department) {
            $query->where('department_assignments.department_id', $department);
        })
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('call_logs', 'encounters.call_log_id', 'call_logs.id')
        ->join('consultation_assignments', 'encounters.id', '=', 'consultation_assignments.encounter_id')
        ->join('department_assignments', 'encounters.id', '=', 'department_assignments.encounter_id')
        ->join('departments', 'department_assignments.department_id', '=', 'departments.id')
        ->join('users', 'call_logs.user_id', '=', 'users.id')
        ->select(
            'encounters.*', 
            'patient_chief_complaints.chief_complaint',
            DB::raw("CONCAT(patient_profiles.lname, ', ', patient_profiles.fname, ' ', patient_profiles.mname) AS patient_profile_name"),
            'patient_profiles.gender', 
            'patient_profiles.dob', 
            'patient_profiles.contact_no',
            'call_logs.transaction_code', 
            'departments.name AS department'
        )
        ->orderBy('encounters.created_at', "DESC")
        ->paginate($pageSize);
    }

    public function forwardToHomis(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        $sent = $request->has('sent') ? $request->sent  : null;
        return ForwardToHomis::when($sent, function($query) use($sent) {
            $query->where('sent', $sent);
        })
        ->join('encounters', 'forward_to_homis.encounter_id', '=', 'encounters.id')
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->select(
            'forward_to_homis.*', 
            DB::raw("CONCAT(patient_profiles.fname,' ', patient_profiles.mname,' ',patient_profiles.lname) AS patient_profile_name"),
            'patient_chief_complaints.chief_complaint',
            'patient_profiles.gender', 
            'patient_profiles.dob',
        )
        ->paginate($pageSize);
    }


}
