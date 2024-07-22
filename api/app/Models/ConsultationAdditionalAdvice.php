<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ActivityLogTrait;

class ConsultationAdditionalAdvice extends Model
{
    use HasFactory, ActivityLogTrait;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot() {
        parent::boot();

        static::created(function($callLog) {
            static::activityLog($callLog, 'created', 'created', 'additional_advice');
        });
    }
}
