<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ActivityLogTrait;

class TeleclerkLog extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot() {
        parent::boot();

        static::creating(function($teleclerkLog) {
            $teleclerkLog->user_id = auth()->id();
        });
    }

    public function hcity() {
        return $this->belongsTo(HOMIS\HCity::class, 'ctycode', 'ctycode');
    }

    
}
