<?php

namespace App\Api\Dashboard;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{Encounter, Department, DepartmentAssignment, ConsultationAssignment, PatientChiefComplaint};
use Illuminate\Support\Facades\DB;

class DashboardController extends ApiController
{
    public function __construct(Department $model) {
        $this->modelQuery = $model->query();
        $this->model = $model;
    }

    public function index(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        $yearMonth = $request->has('year_month') ? $request->year_month : now()->format("Y-m");
        $year = explode('-', $yearMonth)[0];
        $month = explode('-', $yearMonth)[1];
        
        $paginator = $this->modelQuery
            ->where('is_doctor', 1)
            ->paginate($pageSize);

        $items = $paginator->getCollection();

        $modifiedItems = $items->map(function ($item) use($year, $month){
            $item['closed'] = $this->getClosedConsultation($item['id'], $year, $month)->count();
            $item['ongoing'] = $this->getOngoingConsultation($item['id'], $year, $month)->count();
            $item['pending'] = $this->getPendingConsultation($item['id'], $year, $month)->count();
            return $item;
        });

        return $paginator->setCollection($modifiedItems);
    }

    public function getPendingConsultations(Request $request, Department $department) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return $this->getPendingConsultation($department->id, $request->year, $request->month)
        ->select('patient_profiles.*', 'patient_chief_complaints.chief_complaint', DB::raw('null AS doctor'))
        ->paginate($pageSize);
    }

    public function getClosedConsultations(Request $request, Department $department) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return $this->getClosedConsultation($department->id, $request->year, $request->month)
        ->select('patient_profiles.*', 'patient_chief_complaints.chief_complaint', 'users.name AS doctor')
        ->paginate($pageSize);
    }

    public function getOngoingConsultations(Request $request, Department $department) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return $this->getOngoingConsultation($department->id, $request->year, $request->month)
        ->select('patient_profiles.*', 'patient_chief_complaints.chief_complaint', 'users.name AS doctor')
        ->paginate($pageSize);
    }

    public function widgetCounts() {
        return response()->json([
            'newConsultation' =>PatientChiefComplaint::whereDoesntHave('departmentAssignment')->count(),
            'newConsultationData' =>PatientChiefComplaint::whereDoesntHave('departmentAssignment')->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
            ->select('patient_chief_complaints.*', DB::raw("CONCAT(patient_profiles.lname, ', ', patient_profiles.fname, ' ', patient_profiles.mname) AS patient_name"), DB::raw("patient_profiles.dob"), DB::raw("patient_profiles.gender"))
            ->get()
        ], 200);
    }

    protected function getOngoingConsultation($id, $year = null, $month = null) {

        $year = $year ? $year : now()->format("Y");
        $month = $month ? $month : now()->format("m");

        return Encounter::where('encounters.is_active', 1)
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', '=', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('consultation_assignments', function($join) use($year, $month) {
            $join->on('consultation_assignments.encounter_id', '=', 'encounters.id')
            ->whereYear('consultation_assignments.created_at', '>', 2022)
            ->whereYear('consultation_assignments.created_at', $year)
            ->whereMonth('consultation_assignments.created_at', $month);
        })
        ->join('users', function($join) use($id) {
            $join->on('consultation_assignments.doctor_id', '=', 'users.id')
            ->where('users.department_id', $id);
        });
    }

    protected function getClosedConsultation($id, $year = null, $month = null) {

        $year = $year ? $year : now()->format("Y");
        $month = $month ? $month : now()->format("m");

        return Encounter::where('encounters.is_active', 0)
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', '=', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('consultation_assignments', function($join) use($year, $month) {
            $join->on('consultation_assignments.encounter_id', '=', 'encounters.id')
            ->whereYear('consultation_assignments.created_at', '>', 2022)
            ->whereYear('consultation_assignments.created_at', $year)
            ->whereMonth('consultation_assignments.created_at', $month);
        })
        ->join('users', function($join) use($id) {
            $join->on('consultation_assignments.doctor_id', '=', 'users.id')
            ->where('users.department_id', $id);
        });
    }

    protected function getPendingConsultation($id, $year = null, $month = null) {
        
        $year = $year ? $year : now()->format("Y");
        $month = $month ? $month : now()->format("m");

        return Encounter::where('encounters.is_active', 1)
        ->join('patient_chief_complaints', 'encounters.patient_chief_complaint_id', '=', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->join('department_assignments', function($join) use($year, $month, $id) {
            $join->on('department_assignments.encounter_id', '=', 'encounters.id')
            ->whereYear('department_assignments.created_at', '>', 2022)
            ->whereYear('department_assignments.created_at', $year)
            ->whereMonth('department_assignments.created_at', $month)
            ->where('department_id', $id);
        });
    }

    
}
