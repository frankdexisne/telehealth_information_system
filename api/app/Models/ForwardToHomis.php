<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForwardToHomis extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot(){
        parent::boot();

        static::creating(function($forwardToHomis) {
            $forwardToHomis->created_by = auth()->id();
        });
    }

    public function patientChiefComplaint() {
        return $this->belongsTo(PatientChiefComplaint::class);
    }
}
