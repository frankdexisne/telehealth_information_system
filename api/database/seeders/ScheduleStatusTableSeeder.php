<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ScheduleStatus;
use Illuminate\Support\Facades\DB;

class ScheduleStatusTableSeeder extends Seeder
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
        $scheduleStatuses = json_decode($this->oldDB->table('schedule_statuses')
            ->select('id', 'sched_stat AS name', 'created_at', 'updated_at')
            ->get(), true
        );

        ScheduleStatus::upsert($scheduleStatuses, ['id', 'name'], ['id', 'name', 'created_at', 'updated_at']);
    }
}
