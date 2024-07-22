<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};
use App\Traits\ActivityLogTrait;

class ConsultationAssignment extends Model
{
    use HasFactory, ActivityLogTrait, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot(){
        parent::boot();

        static::created(function($consultationAssignment) {
            static::activityLog($consultationAssignment, 'created', 'created', 'consultation_assignment');
        });

        static::forceDeleted(function($consultationAssignment) {
            static::activityLog($consultationAssignment, 'force-deleted', 'force-deleted', 'consultation_assignment');
        });
    }

    public function patientChiefComplaint() {
        return $this->belongsTo(PatientChiefComplaint::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function doctor() {
        return $this->belongsTo(User::class, 'doctor_id', 'id');
    }
}
