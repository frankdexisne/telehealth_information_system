<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CallLog;
use Illuminate\Support\Facades\DB;

class CallLogsTableSeeder extends Seeder
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
        $this->oldDB->table('call_logs')
        ->where('communication_platform', 'phone')
        ->select(
            'id', 'transaction_code', 'user_id', DB::raw("'1' AS platform_id"), DB::raw("'App\\\Models\\\PatientProfile' as caller_type"), 'patient_profile_id AS caller_id', 'deleted_at', 'created_at', 'updated_at'
        )
        ->orderBy('id')
        ->chunk(500, function($callLog) {
            $data = json_decode($callLog, true);
            CallLog::upsert($data, ['id'], ['id', 'transaction_code', 'user_id', 'platform_id', 'caller_type', 'caller_id', 'deleted_at', 'updated_at', 'created_at']);
        });

        $this->oldDB->table('call_logs')
        ->where('communication_platform', 'messenger')
        ->orWhere('communication_platform', 'facebook')
        ->select(
            'id', 'transaction_code', 'user_id', DB::raw("'2' AS platform_id"), DB::raw("'App\\\Models\\\PatientProfile' as caller_type"), 'patient_profile_id AS caller_id', 'deleted_at', 'created_at', 'updated_at'
        )
        ->orderBy('id')
        ->chunk(500, function($callLog) {
            $data = json_decode($callLog, true);
            CallLog::upsert($data, ['id'], ['id', 'transaction_code', 'user_id', 'platform_id', 'caller_type', 'caller_id', 'deleted_at', 'updated_at', 'created_at']);
        });

        $this->oldDB->table('call_logs')
        ->where('communication_platform', 'radio')
        ->select(
            'id', 'transaction_code', 'user_id', DB::raw("'3' AS platform_id"), DB::raw("'App\\\Models\\\PatientProfile' as caller_type"), 'patient_profile_id AS caller_id', 'deleted_at', 'created_at', 'updated_at'
        )
        ->orderBy('id')
        ->chunk(500, function($callLog) {
            $data = json_decode($callLog, true);
            CallLog::upsert($data, ['id'], ['id', 'transaction_code', 'user_id', 'platform_id', 'caller_type', 'caller_id', 'deleted_at', 'updated_at', 'created_at']);
        });

        $this->oldDB->table('call_logs')
        ->where('communication_platform', 'viber')
        ->select(
            'id', 'transaction_code', 'user_id', DB::raw("'4' AS platform_id"), DB::raw("'App\\\Models\\\PatientProfile' as caller_type"), 'patient_profile_id AS caller_id', 'deleted_at', 'created_at', 'updated_at'
        )
        ->orderBy('id')
        ->chunk(500, function($callLog) {
            $data = json_decode($callLog, true);
            CallLog::upsert($data, ['id'], ['id', 'transaction_code', 'user_id', 'platform_id', 'caller_type', 'caller_id', 'deleted_at', 'updated_at', 'created_at']);
        });

    }
}
