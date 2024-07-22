<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ActivityLogTrait;
use Carbon\Carbon;
use App\Models\HOMIS\{Hperson, RefCStatus};
use Str;

class PatientProfile extends Model
{
    use HasFactory, ActivityLogTrait;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected $appends = ['age', 'name'];


    protected static function boot() {
        parent::boot();

        static::creating(function($patientProfile) {
            $patientProfile->slug = static::makeSlug($patientProfile->fname . ' ' . $patientProfile->lname); 
            // $patientProfile->civil_status = RefCStatus::where('dcode', $patientProfile->patcstat)->first()->describe;
            $patientProfile->civil_status = static::getCivilStatus($patientProfile->patcstat);
            $patientProfile->philhealth_member = 'N';
            $patientProfile->address = '';
        });

        static::created(function($patientProfile) {
            static::activityLog($patientProfile, 'created', 'created', 'patient_profile');
        });

        static::updated(function($patientProfile) {
            static::updatingLog($patientProfile, 'updated', 'updated', 'patient_profile');
        });

        static::deleted(function($patientProfile) {
            static::activityLog($patientProfile, 'deleted', 'deleted', 'patient_profile');
        });


    }

    protected static function getCivilStatus(string $patcstat) {
        $civilStatuses = [
            'C' => 'Child',
            'D' => 'Divorced',
            'I' => 'Infant',
            'M' => 'Married',
            'N' => 'Neonate',
            'S' => 'Single',
            'W' => 'Widow',
            'X' => 'Separated'
        ];

        return $civilStatuses[$patcstat];
    }

    public function getAgeAttribute() {
        if ($this->dob) {
            return Carbon::parse($this->dob)->age;
        }
        return null;
    }

    public function getNameAttribute() {
        return $this->lname . ", " . $this->fname . " " . $this->mname;
    }

    protected static function makeSlug($name) {
        $slug = Str::slug($name);
        
        $count = static::whereRaw("slug RLIKE '^{$slug}(-[0-9]+)?$'")->count();
        
        $s = $count ? "{$slug}-{$count}" : $slug;
        
        return $s;
    }

    public function patientChiefComplaint() {
        return $this->hasMany(PatientChiefComplaint::class);
    }

     public function patientSchedule() {
        return $this->morphMany(PatientSchedule::class, 'appointmentable');
    }

    public function demographic() {
        return $this->hasOne(Demographic::class);
    }

    public function callLog() {
        return $this->morphMany(CallLog::class, 'caller');
    }

    public function mapToHomis(string $hpercode) {
        if (!$this->hpercode) {
            $this->update([
                'hpercode' => $hpercode
            ]);
        }
    }

    public function cloneToHomis() {
        $hperson = Hperson::firstOrNew(['hpercode' => $this->hpercode]);

        if (!$hperson->exists) {
            $hperson->fill([
                'patlast' => $this->lname,
                'patfirst' => $this->fname,
                'patmiddle' => $this->mname,
                'patsuffix' => $this->suffix,
                'patbirthdate' => date('Y-m-d H:i:s',strtotime($this->dob)),
                'patcstat' => $this->patcstat,
            ])
            ->save();
        }
    }

   

    
}
