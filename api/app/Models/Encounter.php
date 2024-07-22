<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ActivityLogTrait;

class Encounter extends Model
{
    use HasFactory, ActivityLogTrait;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot() {
        parent::boot();

        static::created(function($encounter) {
            static::activityLog($encounter, 'created', 'created', 'encounter');
        });

        static::updating(function($encounter) {
            if ($encounter->isDirty('is_active') || $encounter->is_active == 0) {
                $encounter->locked_at = now()->format("Y-m-d H:i:s");
                $encounter->locked_by = auth()->id();
                static::updatingLog($encounter, 'lock encounter', 'updated', 'encounter');
            }
        });
    }

    public function patientChiefComplaint() {
        return $this->belongsTo(PatientChiefComplaint::class);
    }

    public function callLog() {
        return $this->belongsTo(CallLog::class);
    }

    public function departmentAssignment() {
        return $this->hasMany(DepartmentAssignment::class);
    }

    public function consultationAssignment() {
        return $this->hasMany(ConsultationAssignment::class);
    }

    public function patientConsultation() {
        return $this->hasMany(PatientConsultation::class);
    }

    public function consultationAdditionalAdvice() {
        return $this->hasMany(ConsultationAdditionalAdvice::class);
    }

    public function forwardToHomis() {
        return $this->hasOne(ForwardToHomis::class);
    }

    public function patientSchedule() {
        return $this->hasOne(PatientSchedule::class);
    }

    public function scopePatientCaller($query) {
        $query->whereHas('callLog', function($query) {
            $query->where('caller_type', 'App\\Models\\PatientProfile');
        });
    }

    public function scopeDepartmentAssigned($query, $isActive = null) {
        $query->whereHas('departmentAssignment', function($query) use($isActive) {
            $query->where('department_id', auth()->user()->department_id);
            if ($isActive) {
                $query->where('is_active', $isActive);
            }
        });
    }   
    

}
