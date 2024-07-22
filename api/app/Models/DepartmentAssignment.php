<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};
use App\Traits\ActivityLogTrait;

class DepartmentAssignment extends Model
{
    use HasFactory, ActivityLogTrait, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot(){
        parent::boot();

        static::created(function($departmentAssignment) {
            static::activityLog($departmentAssignment, 'created', 'created', 'department_assignment');
        });

        static::updated(function($departmentAssignment) {
            if ($departmentAssignment->isDirty('doctor_id')) {
                static::activityLog($departmentAssignment, 'assign to doctor', 'created', 'department_assignment');
            }
        });

        static::forceDeleted(function($departmentAssignment) {
            static::activityLog($departmentAssignment, 'force-deleted', 'force-deleted', 'department_assignment');
        });
    }

    public function department() {
        return $this->belongsTo(Department::class);
    }

    public function doctor() {
        return $this->belongsTo(User::class, 'doctor_id', 'id');
    }
}
