<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use Illuminate\Support\Facades\DB;

class DepartmentsTableSeeder extends Seeder
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
        $departments = json_decode($this->oldDB->table('departments')
        ->select('id', 'name', 'is_doctor', 'is_active', 'created_at', 'updated_at')
        ->get(), true);

        Department::upsert($departments, ['id', 'name'], ['id', 'name', 'is_doctor', 'is_active', 'created_at', 'updated_at']);
    
        
    }
}
