<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PlatformsTableSeeder::class);
        $this->call(PatientConditionsTableSeeder::class);
        $this->call(ConsultationStatusesTableSeeder::class);
        $this->call(RoleAndPermissionsTableSeeder::class);
        $this->call(DaySeeder::class);
        $this->call(MigrateOldDBToNewDB::class);
    }
}
