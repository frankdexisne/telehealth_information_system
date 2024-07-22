<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ConsultationStatus;

class ConsultationStatusesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $consultationStatuses = [
        [
            'id' => 1,
            'name' => 'new consultation'
        ], [
            'id' => 2,
            'name' => 'Nakakausap ang pasyente'
        ],
        ];

        ConsultationStatus::upsert($consultationStatuses, ['id', 'name'], ['id', 'name']);
    }
}
