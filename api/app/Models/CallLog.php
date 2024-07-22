<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\{Model, SoftDeletes};
use App\Traits\ActivityLogTrait;

class CallLog extends Model
{
    use HasFactory, ActivityLogTrait, SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected static function boot() {
        parent::boot();

        static::creating(function($callLog) {
            $callLog->transaction_code = static::generateTransactionCode();
            $callLog->user_id = auth()->id();
        });

        static::created(function($callLog) {
            static::activityLog($callLog, 'created', 'created', 'call_log');
        });
    }

    public function generateCallLog(Model $caller, $platformId) {
        return $this->create([
            'caller_id' => $caller->id,
            'caller_type' => 'App\\Models\\' . class_basename($caller),
            'platform_id' => $platformId
        ]);
    }

    protected static function generateTransactionCode(){
        
        if(static::count() < 1){
            $maxCode="TIS-0000000000";
        }else{
            $maxCode = static::max('transaction_code');
        }
        $str = explode("-", $maxCode);
        $increment = (int)$str[1] + 1;
        $len = strlen($increment);
        $transactionCode = "TIS-";

        for($i = 1; $i <= (10 - $len); $i++){
            $transactionCode .="0";
        }
        $transactionCode .= "".$increment;
        return $transactionCode;
    }

    public function caller() {
        return $this->morphTo();
    }

    public function platform() {
        return $this->belongsTo(Platform::class);
    }

    public function scopePatientCaller($query) {
        $query->where('caller_type', 'App\\Models\\PatientProfile');
    }

    public function scopePatientSearch($query, $request) {
        $query->whereHas('patientProfile', function($query) use($request) {
            if ($request->has('search') && $request->search != "") {
                $query->where(function($query) use($request) {
                    $query->where('lname', 'LIKE', $request->search . '%')
                        ->orWhere('fname', 'LIKE', $request->search . '%')
                        ->orWhere('mname', 'LIKE', $request->search . '%');
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

            if ($request->has('teleclerk')) {
                $query->where('user_id', $request->teleclerk);
            }
        });
    }

    public function patientProfile() {
        return $this->belongsTo(PatientProfile::class, 'caller_id', 'id');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function patientChiefComplaint() {
        return $this->hasOne(PatientChiefComplaint::class);
    }
}
