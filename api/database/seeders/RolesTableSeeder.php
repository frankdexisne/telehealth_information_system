<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\{Role};
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
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
        // $roles = json_decode($this->oldDB->table('user_roles')
        //     ->select('id', DB::raw('LOWER(name) AS name'), DB::raw('UPPER(name) AS display_name'), DB::raw("'sanctum' AS guard_name"), 'created_at', 'updated_at')
        //     ->get(), true
        // );

        // Role::upsert($roles, ['id', 'name'], ['id', 'name', 'display_name', 'guard_name' ,'created_at', 'updated_at']);
        
        $modelHasRoles = json_decode($this->oldDB->table('users')
        ->select('user_role_id AS role_id', DB::raw("'App\\\Models\\\User' AS model_type"), 'id AS model_id')
        ->get(), true);

        DB::table('model_has_roles')->upsert($modelHasRoles, ['role_id', 'model_id'], ['role_id', 'model_id', 'model_type']);
    }
}
