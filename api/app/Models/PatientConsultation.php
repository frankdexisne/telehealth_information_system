<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};
use App\Traits\ActivityLogTrait;

class PatientConsultation extends Model
{
    use HasFactory, ActivityLogTrait, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot(){
        parent::boot();

        static::creating(function($patientConsultation) {
            $patientConsultation->doctor_id = auth()->id();
            $patientConsultation->findings_date = now()->format("Y-m-d H:i:s");
        });

        static::created(function($patientConsultation) {
            if ($patientConsultation->disposition_id == 7) {
                ConsultationAdditionalAdvice::create(['patient_consultation_id' => $patientConsultation->id]);
            }
            static::activityLog($patientConsultation, 'created', 'created', 'patient_consultation');
        });

        static::updating(function($patientConsultation) {
            static::updatingLog($patientConsultation, 'updated', 'updated', 'patient_consultation');
        });

        static::deleted(function($patientConsultation) {
            static::activityLog($patientConsultation, 'deleted', 'deleted', 'patient_consultation');
        });
    }

    public function patientChiefComplaint() {
        return $this->belongsTo(PatientChiefComplaint::class);
    }

    public function doctor() {
        return $this->belongsTo(User::class, 'doctor_id', 'id');
    }

    public function disposition() {
        return $this->belongsTo(Disposition::class);
    }
}
