<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DepartmentAssignment;
use Illuminate\Support\Facades\DB;

class DepartmentAssignmentsTableSeeder extends Seeder
{
    protected $oldDB;

    public function __construct(){
        $this->oldDB = DB::connection('old_telehealth');
    }
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->oldDB->table('department_assignments')
        ->join('patient_chief_complaints', 'department_assignments.patient_chief_complaint_id', '=', 'patient_chief_complaints.id')
        ->join('telehealth_new.encounters', 'patient_chief_complaints.id', '=', 'telehealth_new.encounters.patient_chief_complaint_id')
        ->leftJoin('consultation_follow_ups', 'patient_chief_complaints.id', '=', 'consultation_follow_ups.patient_chief_complaint_id')
        ->whereNull('consultation_follow_ups.patient_chief_complaint_id')
        ->select('department_assignments.id', 'encounters.id AS encounter_id', 'department_id', 'doctor_id', 'department_assignments.deleted_at', 'department_assignments.created_at', 'department_assignments.updated_at', 'accomodated_at', 'completed_at')
       ->orderBy('department_assignments.id')
        ->chunk(500, function($departmentAssignment) {
            $data = json_decode($departmentAssignment, true);
            DepartmentAssignment::upsert($data, ['encounter_id', 'department_id'], ['id', 'encounter_id', 'department_id', 'doctor_id', 'deleted_at', 'created_at', 'updated_at', 'accomodated_at', 'completed_at']);
        });

        $this->oldDB->table('department_assignments')
        ->join('telehealth_new.encounters', 'department_assignments.patient_chief_complaint_id', '=', 'telehealth_new.encounters.patient_chief_complaint_id')
        ->leftJoin('consultation_follow_ups', 'department_assignments.patient_chief_complaint_id', '=', 'consultation_follow_ups.patient_chief_complaint_id')
        ->whereNotNull('consultation_follow_ups.patient_chief_complaint_id')
        ->select('department_assignments.id', 'encounters.id AS encounter_id', 'department_id', 'doctor_id', 'department_assignments.deleted_at', 'department_assignments.created_at', 'department_assignments.updated_at', 'accomodated_at', 'completed_at')
       ->orderBy('department_assignments.id')
        ->chunk(500, function($departmentAssignment) {
            $data = json_decode($departmentAssignment, true);
            DepartmentAssignment::upsert($data, ['encounter_id', 'department_id'], ['id', 'encounter_id', 'department_id', 'doctor_id', 'deleted_at', 'created_at', 'updated_at', 'accomodated_at', 'completed_at']);
        });
    }
}
