<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Designation;
use Illuminate\Support\Facades\DB;

class DesignationTableSeeder extends Seeder
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
        $designations = json_decode($this->oldDB->table('designations')
        ->select('id', 'name', 'is_active', 'deleted_at', 'created_at', 'updated_at')
        ->get()
        , true);

        Designation::upsert($designations, ['id', 'name'], ['id', 'name', 'is_active', 'deleted_at', 'created_at', 'updated_at']);
    }
}
