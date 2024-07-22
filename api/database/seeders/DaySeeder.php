<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Day;
class DaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $days = [
            [
                'id' => 1,
                'prefix' => 'mon',
                'name' => 'Monday'
            ],
            [
                'id' => 2,
                'prefix' => 'tue',
                'name' => 'Tuesday'
            ],
            [
                'id' => 3,
                'prefix' => 'wed',
                'name' => 'Wednesday'
            ],
            [
                'id' => 4,
                'prefix' => 'thru',
                'name' => 'Thursday'
            ],
            [
                'id' => 5,
                'prefix' => 'fri',
                'name' => 'Friday'
            ],
            [
                'id' => 6,
                'prefix' => 'sat',
                'name' => 'Saturday'
            ],
            [
                'id' => 7,
                'prefix' => 'sun',
                'name' => 'Sunday'
            ],
        ];

        Day::upsert($days, ['name', 'prefix'], ['name', 'prefix']);
    }
}
