<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Disposition;
use Illuminate\Support\Facades\DB;

class DispositionTableSeeder extends Seeder
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
        $dispositions = json_decode($this->oldDB->table('library_dispositions')
        ->select('id', 'disposition AS name', 'created_at', 'updated_at')
        ->get()
        , true);

        Disposition::upsert($dispositions, ['id', 'name'], ['id', 'name', 'created_at', 'updated_at']);
    }
}
