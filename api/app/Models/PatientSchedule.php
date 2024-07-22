<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ActivityLogTrait;

class PatientSchedule extends Model
{
    use HasFactory, ActivityLogTrait;

    protected $connection = 'unstrict_mysql';

    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function patientProfile() {
        return $this->belongsTo(PatientProfile::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function scheduleStatus() {
        return $this->belongsTo(ScheduleStatus::class);
    }

    public function appointmentable() {
        return $this->morphTo();
    }

    public function department() {
        return $this->belongsTo(Department::class);
    }
}
