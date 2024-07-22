<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{PatientChiefComplaint, Encounter};
use Illuminate\Support\Facades\DB;

class PatientChiefComplaintsTableSeeder extends Seeder
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
        $this->oldDB->table('patient_chief_complaints')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->whereRaw('patient_chief_complaints.id NOT IN (SELECT patient_chief_complaint_id FROM consultation_follow_ups)')
        ->select('patient_chief_complaints.id', 'patient_chief_complaints.patient_profile_id', 'patient_chief_complaints.chief_complaint', 'patient_chief_complaints.created_at', 'patient_chief_complaints.updated_at')
        ->orderBy('patient_chief_complaints.id')
        ->chunk(500, function($patientChiefComplaints) {
            $data = json_decode($patientChiefComplaints, true);
            PatientChiefComplaint::upsert($data, ['id'], ['id', 'patient_profile_id', 'chief_complaint','created_at', 'updated_at']);
        });

        $this->oldDB->table('patient_chief_complaints')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->whereRaw('patient_chief_complaints.id NOT IN (SELECT patient_chief_complaint_id FROM consultation_follow_ups)')
        ->select(
            'patient_chief_complaints.id AS patient_chief_complaint_id', 
            'patient_chief_complaints.call_log_id', 
            DB::raw('CASE WHEN patient_chief_complaints.is_locked = 1 THEN 0 ELSE 1 END AS is_active'), 
            'patient_chief_complaints.created_at', 
            'patient_chief_complaints.updated_at',
            DB::raw('CASE 
                WHEN `condition` = "Not Applicable" THEN 1
                WHEN `condition` = "Nakakausap ang pasyente" THEN 2
                WHEN `condition` = "Hindi nakakausap ang pasyente" THEN 3
                ELSE 4
            END AS patient_condition_id'),
            DB::raw('CASE 
                WHEN consultation_status = "new consultation" THEN 1
                ELSE 2
            END AS consultation_status_id',
            DB::raw("'0' AS is_follow_up")
            )
        )
        ->orderBy('patient_chief_complaints.id')
        ->chunk(500, function($encounters) {
            $data = json_decode($encounters, true);
            Encounter::upsert($data, ['patient_chief_complaint_id', 'call_log_id'], ['patient_chief_complaint_id', 'call_log_id', 'patient_condition_id', 'consultation_status_id', 'is_follow_up', 'is_active', 'created_at', 'updated_at']);
        });

        $this->oldDB->table('patient_chief_complaints')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->whereRaw('patient_chief_complaints.id IN (SELECT patient_chief_complaint_id FROM consultation_follow_ups)')
        ->select('patient_chief_complaints.id', 'patient_chief_complaints.patient_profile_id', 'patient_chief_complaints.chief_complaint', 'patient_chief_complaints.created_at', 'patient_chief_complaints.updated_at')
        ->orderBy('patient_chief_complaints.id')
        ->chunk(500, function($patientChiefComplaints) {
            $data = json_decode($patientChiefComplaints, true);
            PatientChiefComplaint::upsert($data, ['id'], ['id', 'patient_profile_id', 'chief_complaint','created_at', 'updated_at']);
        });

        $this->oldDB->table('patient_chief_complaints')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->whereRaw('patient_chief_complaints.id IN (SELECT patient_chief_complaint_id FROM consultation_follow_ups)')
        ->select(
            'patient_chief_complaints.id AS patient_chief_complaint_id', 
            'patient_chief_complaints.call_log_id', 
            DB::raw('CASE WHEN patient_chief_complaints.is_locked = 1 THEN 0 ELSE 1 END AS is_active'), 
            'patient_chief_complaints.created_at', 
            'patient_chief_complaints.updated_at',
            DB::raw('CASE 
                WHEN `condition` = "Not Applicable" THEN 1
                WHEN `condition` = "Nakakausap ang pasyente" THEN 2
                WHEN `condition` = "Hindi nakakausap ang pasyente" THEN 3
                ELSE 4
            END AS patient_condition_id'),
            DB::raw('CASE 
                WHEN consultation_status = "new consultation" THEN 1
                ELSE 2
            END AS consultation_status_id',
            DB::raw("'0' AS is_follow_up")
            )
        )
        ->orderBy('patient_chief_complaints.id')
        ->chunk(500, function($encounters) {
            $data = json_decode($encounters, true);
            Encounter::upsert($data, ['patient_chief_complaint_id', 'call_log_id'], ['patient_chief_complaint_id', 'call_log_id', 'patient_condition_id', 'consultation_status_id', 'is_follow_up', 'is_active', 'created_at', 'updated_at']);
        });

        $this->oldDB->table('consultation_follow_ups')
        ->join('patient_chief_complaints', 'consultation_follow_ups.patient_chief_complaint_id', '=', 'patient_chief_complaints.id')
        ->join('patient_profiles', 'patient_chief_complaints.patient_profile_id', '=', 'patient_profiles.id')
        ->select(
            'patient_chief_complaint_id', 
            'patient_chief_complaints.call_log_id', 
            'consultation_follow_ups.is_active', 
            'consultation_follow_ups.created_at', 
            'consultation_follow_ups.updated_at',
            DB::raw('CASE 
                WHEN `condition` = "Not Applicable" THEN 1
                WHEN `condition` = "Nakakausap ang pasyente" THEN 2
                WHEN `condition` = "Hindi nakakausap ang pasyente" THEN 3
                ELSE 4
            END AS patient_condition_id'),
            DB::raw('CASE 
                WHEN consultation_status = "new consultation" THEN 1
                ELSE 2
            END AS consultation_status_id'
        ),
            DB::raw("1 AS is_follow_up")
        )
        ->orderBy('consultation_follow_ups.id')
        ->chunk(500, function($encounters) {
            $data = json_decode($encounters, true);
            Encounter::upsert($data, [], ['patient_chief_complaint_id', 'call_log_id', 'patient_condition_id', 'consultation_status_id', 'is_follow_up', 'is_active', 'created_at', 'updated_at']);
        
        });
        
    }
}
