<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};
use App\Traits\ActivityLogTrait;

class ConsultationAttachment extends Model
{
    use HasFactory, ActivityLogTrait, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function patientChiefComplaint() {
        return $this->belongsTo(PatientChiefComplaint::class);
    }

    protected static function boot(){
        parent::boot();

        static::created(function($consultationAttachment) {
            static::activityLog($consultationAttachment, 'created', 'created', 'consultation_attachments');
        });

        static::forceDeleted(function($consultationAttachment) {
            static::activityLog($consultationAttachment, 'force-deleted', 'force-deleted', 'consultation_attachments');
        });
    }
}
