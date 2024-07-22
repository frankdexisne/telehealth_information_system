<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ConsultationAssignment;
use Illuminate\Support\Facades\DB;

class ConsultationAssignmentsTableSeeder extends Seeder
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
        $this->oldDB->table('consultation_assignments')
        ->join('telehealth_new.encounters', 'consultation_assignments.patient_chief_complaint_id', '=', 'telehealth_new.encounters.patient_chief_complaint_id')
        ->leftJoin('consultation_follow_ups', 'consultation_assignments.patient_chief_complaint_id', '=', 'consultation_follow_ups.patient_chief_complaint_id')
        ->whereNull('consultation_follow_ups.patient_chief_complaint_id')
        ->select('consultation_assignments.id', 'user_id', 'doctor_id', 'encounters.id AS encounter_id', 'consultation_assignments.is_active', 'consultation_assignments.deleted_at', 'consultation_assignments.created_at', 'consultation_assignments.updated_at')
        ->orderBy('consultation_assignments.id')
        ->chunk(500, function($consultationAssignments) {
            $data = json_decode($consultationAssignments, true);
            ConsultationAssignment::upsert($data, ['doctor_id', 'encounter_id'], ['id', 'doctor_id', 'encounter_id', 'is_active', 'deleted_at', 'created_at', 'updated_at']);
        });

        $this->oldDB->table('consultation_assignments')
        ->join('telehealth_new.encounters', 'consultation_assignments.patient_chief_complaint_id', '=', 'telehealth_new.encounters.patient_chief_complaint_id')
        ->leftJoin('consultation_follow_ups', 'consultation_assignments.patient_chief_complaint_id', '=', 'consultation_follow_ups.patient_chief_complaint_id')
        ->whereNotNull('consultation_follow_ups.patient_chief_complaint_id')
        ->select('consultation_assignments.id', 'user_id', 'doctor_id', 'encounters.id AS encounter_id', 'consultation_assignments.is_active', 'consultation_assignments.deleted_at', 'consultation_assignments.created_at', 'consultation_assignments.updated_at')
        ->orderBy('consultation_assignments.id')
        ->chunk(500, function($consultationAssignments) {
            $data = json_decode($consultationAssignments, true);
            ConsultationAssignment::upsert($data, ['doctor_id', 'encounter_id'], ['id', 'doctor_id', 'encounter_id', 'is_active', 'deleted_at', 'created_at', 'updated_at']);
        });
    }
}
