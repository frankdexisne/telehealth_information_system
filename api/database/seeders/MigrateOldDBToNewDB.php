<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class MigrateOldDBToNewDB extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $this->call(DesignationTableSeeder::class);
        $this->call(DepartmentsTableSeeder::class);
        $this->call(DispositionTableSeeder::class);
        $this->call(ScheduleStatusTableSeeder::class);
        $this->call(RolesTableSeeder::class);
        $this->call(UsersTableSeeder::class);

        $this->call(PatientProfileTableSeeder::class);
        $this->call(CallLogsTableSeeder::class);
        $this->call(CallDropsTableSeeder::class);
        $this->call(PatientChiefComplaintsTableSeeder::class);
        $this->call(DepartmentAssignmentsTableSeeder::class);
        $this->call(ConsultationAssignmentsTableSeeder::class);

        // RUN ONLY ONCE THERE'S NO UNIQUE DISTINCTION OF THIS RECORD
        $this->call(PatientConsultationsTableSeeder::class);
        $this->call(ConsultationAttachmentsTableSeeder::class);
        
        

        

        
        

        

        

        

        

    


    }
}
