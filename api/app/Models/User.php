<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use DB;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'department_id',
        'designation_id',
        'hpersonal_code'
    ];

    protected $appends = [
        'role_name',
        'role_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function department() {
        return $this->belongsTo(Department::class);
    }

    public function designation() {
        return $this->belongsTo(Designation::class);
    }

    public function getRoleNameAttribute() {
        $role = DB::table('model_has_roles')
        ->where('model_type', 'App\\Models\\User')
        ->where('model_id', $this->id)
        ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
        ->select('roles.*')
        ->first();

        return $role ? $role->name : null;
    }
    
    public function getRoleIdAttribute() {
        $role = DB::table('model_has_roles')
        ->where('model_type', 'App\\Models\\User')
        ->where('model_id', $this->id)
        ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
        ->select('roles.*')
        ->first();

        return $role ? $role->id : null;
    }

    protected static function boot() {
        parent::boot();

        static::created(function($user) {
            $roleId = request('role_id');
            if ($roleId) {
                DB::table('model_has_roles')->insert([
                    'model_type' => 'App\\Models\\User',
                    'model_id' => $user->id,
                    'role_id' => $roleId
                ]);
            }
        });


    }
}
