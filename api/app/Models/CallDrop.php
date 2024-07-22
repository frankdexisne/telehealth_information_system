<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};
use App\Traits\ActivityLogTrait;

class CallDrop extends Model
{
    use HasFactory, ActivityLogTrait, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot(){
        parent::boot();

        static::creating(function($callDrop) {
            $callDrop->user_id = auth()->id();
        });

        static::created(function($callDrop) {
            static::activityLog($callDrop, 'created', 'created', 'call_drop');
        });

        static::updating(function($callDrop) {
            static::updatingLog($callDrop, 'updated', 'updated', 'call_drop');
        });

        static::deleted(function($callDrop) {
            static::activityLog($callDrop, 'deleted', 'deleted', 'call_drop');
        });
    }
}
