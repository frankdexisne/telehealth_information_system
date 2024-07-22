<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model};
use App\Traits\ActivityLogTrait;

class PatientChiefComplaint extends Model
{
    use HasFactory, ActivityLogTrait;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot(){
        parent::boot();

        static::created(function($patientChiefComplaint) {
            static::activityLog($patientChiefComplaint, 'created', 'created', 'patient_chief_complaint');
        });

        static::updating(function($patientChiefComplaint) {
            static::updatingLog($patientChiefComplaint, 'updated', 'updated', 'patient_chief_complaint');
        });

        static::deleted(function($patientChiefComplaint) {
            static::activityLog($patientChiefComplaint, 'deleted', 'deleted', 'patient_chief_complaint');
        });
    }

    public function patientProfile() {
        return $this->belongsTo(PatientProfile::class);
    }

    public function consultationAttachment() {
        return $this->hasMany(ConsultationAttachment::class);
    }

    public function encounter() {
        return $this->hasMany(Encounter::class);
    }

    public function scopePatientSearch($query, $request) {
        $query->when($request, function ($query) use ($request) { 
            if ($request->has('search') && $request->search != "") {
                $query->where(function($query) use($request) {
                    $query->whereHas('patientProfile', function($query) use($request) {
                        $query->where('lname', 'LIKE', $request->search . '%')
                        ->orWhere('fname', 'LIKE', $request->search . '%')
                        ->orWhere('mname', 'LIKE', $request->search . '%');
                    });
                });
            }

            if ($request->has('name') && $request->name != "") {
                $query->where(function($query) use($request) {
                    $query->where('lname', 'LIKE', $request->name . '%')
                    ->orWhere('fname', 'LIKE', $request->name . '%')
                    ->orWhere('mname', 'LIKE', $request->name . '%');
                });
            }

            if ($request->has('gender')) {
                $query->where('gender', $request->gender);
            }
        });
    }

    public function scopePatientConsultation($query) {
        $query->where('doctor_id', auth()->id());
    }

    public function forwardToHomis() {
        return $this->hasOne(ForwardToHomis::class);
    }

}
