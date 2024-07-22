<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PatientConsultation;
use Illuminate\Support\Facades\DB;

class PatientConsultationsTableSeeder extends Seeder
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
        // $this->oldDB->table('patient_consultations')
        // ->join('telehealth_latest.encounters', 'patient_consultations.patient_chief_complaint_id', '=', 'telehealth_latest.encounters.patient_chief_complaint_id')
        // ->leftJoin('consultation_follow_ups', 'patient_consultations.patient_chief_complaint_id', '=', 'consultation_follow_ups.patient_chief_complaint_id')
        // ->whereNull('consultation_follow_ups.patient_chief_complaint_id')
        // ->select('patient_consultations.id', 'encounters.id AS encounter_id', 'doctor_id', 'library_disposition_id AS disposition_id', 'findings', DB::raw("STR_TO_DATE(findings_date, '%M-%d-%Y %h:%i:%s %p') AS findings_date"), 'patient_consultations.deleted_at', 'patient_consultations.created_at', 'patient_consultations.updated_at')
        // ->orderBy('patient_consultations.id')
        // ->chunk(500, function($patientConsultation) {
        //     $data = json_decode($patientConsultation, true);
        //     PatientConsultation::upsert($data, [], ['id', 'encounter_id', 'encounter_id', 'doctor_id', 'disposition_id', 'findings', 'findings_date', 'deleted_at', 'created_at', 'updated_at']);
        // });

        $this->oldDB->table('patient_consultations')
        ->join(
            'telehealth_new.encounters', 
            'patient_consultations.patient_chief_complaint_id', 
            '=', 
            'telehealth_new.encounters.patient_chief_complaint_id'
        )
        ->whereRaw('
            patient_consultations.patient_chief_complaint_id NOT IN 
            (
                SELECT 
                    patient_chief_complaint_id 
                FROM 
                    consultation_follow_ups 
                INNER JOIN 
                patient_chief_complaints ON 
                    consultation_follow_ups.patient_chief_complaint_id = patient_chief_complaints.id 
                INNER JOIN 
                    patient_profiles ON 
                patient_chief_complaints.patient_profile_id = patient_profiles.id
            )
        ')
        ->select('patient_consultations.id', 'encounters.id AS encounter_id', 'doctor_id', 'library_disposition_id AS disposition_id', 'findings', DB::raw("STR_TO_DATE(findings_date, '%M-%d-%Y %h:%i:%s %p') AS findings_date"), 'patient_consultations.deleted_at', 'patient_consultations.created_at', 'patient_consultations.updated_at')
        ->orderBy('patient_consultations.id')
        ->chunk(500, function($patientConsultation) {
            $data = json_decode($patientConsultation, true);
            PatientConsultation::upsert($data, [], ['id', 'encounter_id', 'encounter_id', 'doctor_id', 'disposition_id', 'findings', 'findings_date', 'deleted_at', 'created_at', 'updated_at']);
        });

        $this->oldDB->table('patient_consultations')
        ->join(
            'telehealth_new.encounters', 
            'patient_consultations.patient_chief_complaint_id', 
            '=', 
            'telehealth_new.encounters.patient_chief_complaint_id'
        )
        ->whereRaw('
            patient_consultations.patient_chief_complaint_id IN 
            (
                SELECT 
                    patient_chief_complaint_id 
                FROM 
                    consultation_follow_ups 
                INNER JOIN 
                patient_chief_complaints ON 
                    consultation_follow_ups.patient_chief_complaint_id = patient_chief_complaints.id 
                INNER JOIN 
                    patient_profiles ON 
                patient_chief_complaints.patient_profile_id = patient_profiles.id
            )
        ')
        ->select('patient_consultations.id', 'encounters.id AS encounter_id', 'doctor_id', 'library_disposition_id AS disposition_id', 'findings', DB::raw("STR_TO_DATE(findings_date, '%M-%d-%Y %h:%i:%s %p') AS findings_date"), 'patient_consultations.deleted_at', 'patient_consultations.created_at', 'patient_consultations.updated_at')
        ->orderBy('patient_consultations.id')
        ->chunk(500, function($patientConsultation) {
            $data = json_decode($patientConsultation, true);
            PatientConsultation::upsert($data, [], ['id', 'encounter_id', 'encounter_id', 'doctor_id', 'disposition_id', 'findings', 'findings_date', 'deleted_at', 'created_at', 'updated_at']);
        });
    }
}
