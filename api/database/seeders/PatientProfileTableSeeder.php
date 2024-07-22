<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{PatientProfile, PatientSchedule};
use Illuminate\Support\Facades\DB;

class PatientProfileTableSeeder extends Seeder
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
        $this->oldDB->table('patient_profiles')
        ->where('id', 131)
        ->update(['dob' => '1990-10-10']);

        $this->oldDB->table('patient_profiles')
        ->select(
            'id', 'slug', 'lname', 'fname', 'mname', 'dob', 'gender', 'contact_no',
            'occupation', 'philhealth_member', 'address', 'informant', 'fbname',
            'informant_relationship', 'is_pregnant', 'created_at', 'updated_at', 'civil_status'
        )
        ->orderBy('id')
        ->chunk(500, function($patientProfiles) {
            $data = json_decode($patientProfiles, true);
            PatientProfile::upsert($data, ['id', 'slug'], ['id', 'slug', 'lname', 'fname', 'mname', 'dob', 'gender', 'contact_no', 'occupation', 'civil_status', 'philhealth_member', 'address', 'informant', 'fbname', 'informant_relationship', 'is_pregnant', 'deleted_at', 'updated_at', 'created_at']);
        });

        $this->oldDB->table('patient_schedules')
        ->select('id', 'user_id', 'patient_profile_id', 'schedule_status_id', 'reason', DB::raw("CONCAT(schedule_date, ' ', schedule_time) AS schedule_datetime"), 'deleted_at', 'created_at', 'updated_at')
        ->orderBy('patient_schedules.id')
        ->chunk(500, function($patientSchedule) {
            $data = json_decode($patientSchedule, true);
            PatientSchedule::upsert($data, ['patient_profile_id', 'schedule_datetime'], ['id', 'user_id', 'patient_profile_id', 'schedule_status_id', 'reason', 'schedule_datetime', 'deleted_at', 'created_at', 'updated_at']);
        });
    }
}
