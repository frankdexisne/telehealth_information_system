<?php

namespace App\Models\HOMIS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\{PatientProfile, Demographic};

class Hperson extends Model
{
    use HasFactory;

    protected $connection = 'homis';

    public $timestamps = false;

    protected $fillable = [
        'hfhudcode', 
        'hpercode', 
        'hpatcode',
        'hpatkey', 
        'hspocode', 
        'citcode', 
        'upistcode', 
        'patstat', 
        'patlock', 
        'updsw',
        'confdl',
        'fm_dec',
        'createdate',
        'sysrem',
        'entryby',
        'patlast',
        'patfirst',
        'patmiddle',
        'patsuffix',
        'patbdate',
        'patcstat',
        'patsex'
    ];

    protected $table = 'hperson';

    protected static function boot(){
        parent::boot();

        static::creating(function($hperson) {
            $hospitalNumber = static::getLastHospitalNumber()->hpercode + 1;
            $code = str_pad($hospitalNumber, 15, "0", STR_PAD_LEFT);
            // $hperson->id = encrypt($code);
            $hfhudcode = '0001836';
            $hperson->hfhudcode = $hfhudcode;
            $hperson->hpercode = $code;
            $hperson->hpatcode = $code;
            $hperson->hpatkey = $hfhudcode . $code;
            $hperson->hspocode = 'N/A';
            $hperson->citcode = 'FILIP';
            $hperson->upistcode = 'T';
            $hperson->patstat = 'A';
            $hperson->patlock = 'N';
            $hperson->updsw = 'N';
            $hperson->confdl = 'N';
            $hperson->fm_dec = 'N';
            $hperson->createdate = now();
            $hperson->sysrem = 'TH';
            $hperson->entryby = auth()->user()->hpersonal_code;
        });

        static::created(function($hperson) {
            // static::activityLog($hperson, 'created', 'created', 'hperson');
        });
    }

    protected static function getLastHospitalNumber() {
        return static::selectRaw('MAX(CONVERT(INT, hpercode)) as hpercode')
            ->whereRaw('LEN(hpercode) = 15')
            ->first();
    }

    public function patientClone($contactNo, $occupation) {
        $patientProfile = PatientProfile::firstOrNew(['hpercode' => $this->hpercode]);

        if (!$patientProfile->exists) {
            $newPatientProfile = PatientProfile::create([
                'hpercode' => $this->hpercode,
                'lname' => $this->patlast,
                'fname' => $this->patfirst,
                'mname' => $this->patmiddle,
                'suffix' => $this->patsuffix,
                'dob' => date('Y-m-d', strtotime($this->patbdate)),
                'patcstat' => $this->patcstat,
                'civil_status' => $this->getCivilStatus($this->patcstat),
                'gender' => $this->patsex == 'M' ? "Male" : 'Female',
                'address' => '',
                'contact_no' => $contactNo,
                'occupation' => $occupation,
                'philhealth_member' => 'N'
            ]);

            $activeAddress = $this->haddr()->firstWhere(['addstat' => 'A']);

            Demographic::create([
                'patient_profile_id' => $newPatientProfile->id,
                'patstr' => $activeAddress->patstr,
                'brg' => $activeAddress->brg,
                'ctycode' => $activeAddress->ctycode,
                'provcode' => $activeAddress->provcode,
                'describe' => '',
                'link_to_homis' => 1
            ]);

            return $newPatientProfile->id;
        }

        return $patientProfile->id;
    }

    public function haddr() {
        return $this->hasMany(Haddr::class, 'hpercode', 'hpercode');
    }

    public function getCivilStatus($stat) {
        $statuses = [
            'C' => 'Child',
            'D' => 'Divorce',
            'I' => 'Infant',
            'M' => 'Married',
            'N' => 'Neonate',
            'S' => 'Single',
            'W' => 'Widow',
            'X' => 'Separated'
        ];

        if (!$statuses[$stat]) return '';

        return $statuses[$stat];
    }
}
