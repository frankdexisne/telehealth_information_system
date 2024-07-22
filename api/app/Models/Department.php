<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function day() {
        return $this->belongsToMany(Day::class, 'department_has_schedule');
    }

    public function departmentHasSchedule() {
        return $this->hasMany(DepartmentHasSchedule::class);
    }

    public function patientSchedule() {
        return $this->hasMany(PatientSchedule::class);
    }
}
