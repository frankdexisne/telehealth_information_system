<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};
use App\Traits\ActivityLogTrait;

class ConsultationFollowUp extends Model
{
    use HasFactory, ActivityLogTrait, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function patientChiefComplaint() {
        return $this->belongsTo(PatientChiefComplaint::class);
    }

    protected static function boot(){
        parent::boot();

        static::created(function($consultationFollowUp) {
            static::activityLog($consultationFollowUp, 'created', 'created', 'brand');
        });


        static::forceDeleted(function($consultationFollowUp) {
            static::activityLog($consultationFollowUp, 'force-deleted', 'force-deleted', 'patient_chief_complaint');
        });
    }
}
