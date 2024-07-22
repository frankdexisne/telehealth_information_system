<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CallDrop;
use Illuminate\Support\Facades\DB;

class CallDropsTableSeeder extends Seeder
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
        $this->oldDB->table('call_drops')
            ->where('communication_platform', 'phone')
            ->select(
                'id', 'transaction_code', DB::raw("'1' AS platform_id"), DB::raw("'App\\\Models\\\PatientProfile' as caller_type"), 'deleted_at', 'created_at', 'updated_at'
            )
            ->orderBy('id')
            ->chunk(500, function($callLog) {
                $data = json_decode($callLog, true);
                CallDrop::upsert($data, ['id'], ['id', 'transaction_code', 'platform_id', 'caller_type', 'deleted_at', 'updated_at', 'created_at']);
            });

        $this->oldDB->table('call_drops')
            ->where('communication_platform', 'facebook')
            ->orWhere('communication_platform', 'messenger')
            ->select(
                'id', 'transaction_code', DB::raw("'2' AS platform_id"), DB::raw("'App\\\Models\\\PatientProfile' as caller_type"), 'deleted_at', 'created_at', 'updated_at'
            )
            ->orderBy('id')
            ->chunk(500, function($callLog) {
                $data = json_decode($callLog, true);
                CallDrop::upsert($data, ['id'], ['id', 'transaction_code', 'platform_id', 'caller_type', 'deleted_at', 'updated_at', 'created_at']);
            });

        $this->oldDB->table('call_drops')
            ->where('communication_platform', 'radio')
            ->select(
                'id', 'transaction_code', DB::raw("'3' AS platform_id"), DB::raw("'App\\\Models\\\PatientProfile' as caller_type"), 'deleted_at', 'created_at', 'updated_at'
            )
            ->orderBy('id')
            ->chunk(500, function($callLog) {
                $data = json_decode($callLog, true);
                CallDrop::upsert($data, ['id'], ['id', 'transaction_code', 'platform_id', 'caller_type', 'deleted_at', 'updated_at', 'created_at']);
            });
        
        $this->oldDB->table('call_drops')
            ->where('communication_platform', 'viber')
            ->select(
                'id', 'transaction_code', DB::raw("'4' AS platform_id"), DB::raw("'App\\\Models\\\PatientProfile' as caller_type"), 'deleted_at', 'created_at', 'updated_at'
            )
            ->orderBy('id')
            ->chunk(500, function($callLog) {
                $data = json_decode($callLog, true);
                CallDrop::upsert($data, ['id'], ['id', 'transaction_code', 'platform_id', 'caller_type', 'deleted_at', 'updated_at', 'created_at']);
            });
    }
}
