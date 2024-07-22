<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PatientSchedule;

class UpdatePatientScheduleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $patientSchedules = PatientSchedule::all();
        foreach ($patientSchedules as $patientSchedule) {
            $patientSchedule->appointmentable_id = $patientSchedule->patient_profile_id;
            $patientSchedule->appointmentable_type = 'App\Models\PatientProfile';
            $patientSchedule->save();
        }
    }
}
