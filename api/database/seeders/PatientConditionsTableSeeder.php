<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PatientCondition;
class PatientConditionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $patientConditions = [
        [
            'id' => 1,
            'name' => 'Not Applicable'
        ], [
            'id' => 2,
            'name' => 'Nakakausap ang pasyente'
        ], [
            'id' => 3,  
            'name' => 'Hindi nakakausap ang pasyente'
        ], [
            'id' => 4,
            'name' => 'Pedia'
        ]
        ];

        PatientCondition::upsert($patientConditions, ['id', 'name'], ['id', 'name']);
    }
}
