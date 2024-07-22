<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ActivityLogTrait;
use App\Models\HOMIS\HAddr;

class Demographic extends Model
{
    use HasFactory, ActivityLogTrait;

    protected $dates = ['deleted_at'];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot(){
        parent::boot();

        static::creating(function($demographic) {
            $demographic->cntrycode = $demographic->cntrycode || 'PHIL';
            $demographic->addstat = 'A';
        });

        static::created(function($demographic) {
            static::activityLog($demographic, 'created', 'created', 'demographic');
        });

        static::updating(function($demographic) {
            static::updatingLog($demographic, 'updated', 'updated', 'demographic');
        });

        static::deleted(function($demographic) {
            static::activityLog($demographic, 'deleted', 'deleted', 'demographic');
        });
    }

    public function patientProfile() {
        return $this->belongsTo(PatientProfile::class);
    }

    
}
