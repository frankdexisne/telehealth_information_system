<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
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
        $this->oldDB->table('users')->where('id', 392)->update(['designation_id' => 9]);

        $users = json_decode($this->oldDB->table('users')
        ->select('id', 'name', 'department_id', 'designation_id', 'email', 'password','is_active', 'created_at', 'updated_at')
        ->get()
        , true);

        User::upsert($users, ['id', 'email'], ['id', 'name', 'email', 'password', 'department_id', 'designation_id', 'is_active', 'created_at', 'updated_at']);
    }
}
