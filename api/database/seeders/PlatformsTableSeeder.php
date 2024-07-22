<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Platform;
class PlatformsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $platforms = [
            [
                'id' => 1,
                'name' => 'phone'
            ], [
                'id' => 2,
                'name' => 'facebook/messenger'
            ], [
                'id' => 3,
                'name' => 'radio'
            ], [
                'id' => 4,
                'name' => 'viber'
            ]
            ];

            Platform::upsert($platforms, ['id', 'name'], ['id', 'name']);
    }
}
