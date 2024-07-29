<?php

namespace App\Api\Patients;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{PatientProfile, Encounter, PatientChiefComplaint, PatientSchedule, Demographic, CallLog, TeleserveDemographic, TeleclerkLog, ForwardToHomis, TeleservePatient};
use App\Models\HOMIS\{Hperson, Haddr, HEnct, HRegion, HProv, HCity, HBrgy};
use App\Http\Requests\PatientRequest;
use Symfony\Component\HttpFoundation\Response;
use DB;
use GuzzleHttp\Client;
use App\Traits\{PatientTrait, WebSocketTrait};

class PatientController extends ApiController
{

    use PatientTrait, WebSocketTrait;

    public function __construct(PatientProfile $patientProfile) {
        $this->modelQuery = $patientProfile->query();
        $this->model = $patientProfile;
        $this->callLog = new CallLog();
    }

    public function index(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        // $isPatientSearch = $request->has('searching') ? true : false;

        $patientQuery = $this->modelQuery
        ->when($request, function ($query) use ($request) {
            $this->searchHandler($query, $request);
        });

        return $patientQuery
            ->paginate($pageSize);
    }

    public function teleservicePatientSearch(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        $teleServePatient = TeleservePatient::when($request, function($query) use($request) {
            $this->teleserveSearchHandler($query, $request);
        })
        ->select(
            'hpercode', 
            'lname', 
            'fname', 
            'mname', 
            'gender',
            
        );

        if ($teleServePatient->count() > 0) {
            return $teleServePatient->paginate($pageSize);
        }

        $patientQuery = $this->modelQuery
        ->when($request, function ($query) use ($request) {
            $this->teleserveSearchHandler($query, $request);
        });

        if($patientQuery->count() > 0) {
            return $patientQuery
            ->paginate($pageSize);
        }
        

        return Hperson::when($request, function($query) use($request) {
                    $this->homisSearchHandler($query, $request);
                })
                ->select(
                    'hpercode', 
                    'patlast AS lname', 
                    'patfirst AS fname', 
                    'patmiddle AS mname', 
                    DB::raw('CONCAT(patlast, ", ", patfirst, " ", patmiddle) AS name'),
                    DB::raw("CASE WHEN patsex = 'M' THEN 'Male' ELSE 'Female' END AS gender"), 
                    DB::raw("FORMAT(patbdate, 'yyyy-MM-dd') AS dob")
                )
                ->paginate($pageSize);

    }

     protected function getProvinceName($provCode) {
        $province = HProv::where('provcode', $provCode)->first();
        return $province ? $province->provname : null;
    }

    protected function getRegionName($regCode) {
        $region = HRegion::where('regcode', $regCode)->first();
        return $region ? $region->regname : null;
    }

    protected function getCityName($ctyCode) {
        $city = HCity::where('ctycode', $ctyCode)->first();
        return $city ? $city->ctyname : null;
    }

    protected function getBrgName($bgyCode) {
        $brg = HBrgy::where('bgycode', $bgyCode)->first();
        return $brg ? $brg->bgyname : null;
    } 

    public function patientSearch(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        $patientQuery = $this->modelQuery
        ->when($request, function ($query) use ($request) {
            $this->searchHandler($query, $request);
        });

        if($patientQuery->count() > 0) {
            $paginator =  $patientQuery
            ->leftJoin('demographics', 'patient_profiles.id', '=', 'demographics.patient_profile_id')
            ->select('patient_profiles.*', 'demographics.brg', 'demographics.ctycode', 'demographics.provcode', 'demographics.regcode', 'demographics.patzip', 'demographics.patstr')
            ->paginate($pageSize);

            $items = $paginator->getCollection();

            $modifiedItems = $items->map(function ($item){
                $item['regname'] = $this->getRegionName($item->regcode);
                $item['provname'] = $this->getProvinceName($item->provcode);
                $item['ctyname'] = $this->getCityName($item->ctycode);
                $item['bgyname'] = $this->getBrgName($item->brg);
                return $item;
            });
            
            return $paginator->setCollection($modifiedItems);
        }
        

        return Hperson::when($request, function($query) use($request) {
                    $this->homisSearchHandler($query, $request);
                })
                ->leftJoin('haddr', function($join) {
                    $join->on('hperson.hpercode', '=', 'haddr.hpercode')
                    ->where('addstat', 'A');
                })
                ->leftJoin('hbrgy', 'haddr.brg', '=', 'hbrgy.bgycode')
                ->leftJoin('hcity', 'haddr.ctycode', '=', 'hcity.ctycode')
                ->leftJoin('hprov', 'haddr.provcode', 'hprov.provcode')
                ->leftJoin('hregion', 'hprov.provreg', '=', 'hregion.regcode')
                ->select(
                    'hperson.hpercode', 
                    'patlast AS lname', 
                    'patfirst AS fname', 
                    'patmiddle AS mname', 
                    DB::raw("CASE WHEN patsex = 'M' THEN 'Male' ELSE 'Female' END AS gender"), 
                    DB::raw("CONVERT(char(10), patbdate,126) AS dob"),
                    'haddr.brg',
                    'haddr.ctycode',
                    'haddr.provcode',
                    'hbrgy.bgyname',
                    'hcity.ctyname',
                    'hprov.provname',
                    'hregion.regcode',
                    'hregion.regname'
                )
                ->paginate($pageSize);
    }

    protected function homisSearchHandler($query, Request $request) {
        $lname = $request->has('lname') ? $request->lname : null;
        $fname = $request->has('fname') ? $request->fname : null;
        $mname = $request->has('mname') ? $request->mname : null;
        $hpercode = $request->has('hpercode') ? $request->hpercode : null;

        $query->when($hpercode, function($query) use($hpercode) {
            $query->where('hperson.hpercode', str_pad($hpercode, 15, "0", STR_PAD_LEFT));
        })
        ->when($lname, function($query) use($lname) {
            $query->where('patlast', 'LIKE', $lname . '%');
        })
        ->when($fname, function($query) use($fname) {
            $query->where('patfirst', 'LIKE', $fname . '%');
        })
        ->when($mname, function($query) use($mname) {
            $query->where('patmiddle', 'LIKE', $mname . '%');
        });
    }

    protected function teleserveSearchHandler($query, Request $request) {
        $lname = $request->has('lname') ? $request->lname : null;
        $fname = $request->has('fname') ? $request->fname : null;
        $mname = $request->has('mname') ? $request->mname : null;
        $hpercode = $request->has('hpercode') ? $request->hpercode : null;

        $query->when($hpercode, function($query) use($hpercode) {
            $query->where('hpercode', str_pad($hpercode, 15, "0", STR_PAD_LEFT));
        })
        ->when($lname, function($query) use($lname) {
            $query->where('lname', 'LIKE', $lname . '%');
        })
        ->when($fname, function($query) use($fname) {
            $query->where('fname', 'LIKE', $fname . '%');
        })
        ->when($mname, function($query) use($mname) {
            $query->where('mname', 'LIKE', $mname . '%');
        });
    }

    protected function searchHandler($query, Request $request) {
        $search = $request->has('search') ? $request->search : null;
        $name = $request->has('name') ? $request->name : null;
        $lname = $request->has('lname') ? $request->lname : null;
        $fname = $request->has('fname') ? $request->fname : null;
        $mname = $request->has('mname') ? $request->mname : null;
        $gender = $request->has('gender') ? $request->gender : null;
        $hpercode = $request->has('hpercode') ? $request->hpercode : null;

        return $query
        ->when($search, function($query) use($search) {
            $query->where('hpercode', 'LIKE', $search . "%")
            ->orWhere('lname', 'LIKE', $search . '%')
            ->orWhere('fname', 'LIKE', $search . '%')
            ->orWhere('mname', 'LIKE', $search . '%');
        })
        ->when($lname, function($query) use($lname) {
            $query->where('lname', 'LIKE', $lname . '%');
        })
        ->when($fname, function($query) use($fname) {
            $query->where('fname', 'LIKE', $fname . '%');
        })
        ->when($mname, function($query) use($mname) {
            $query->where('mname', 'LIKE', $mname . '%');
        })
        ->when($hpercode, function($query) use($hpercode) {
            $query->where('hpercode', str_pad($hpercode, 15, "0", STR_PAD_LEFT));
        })
        ->when($gender, function($query) use($gender) {
            $query->where('gender', $gender);
        });
    }

    public function store(PatientRequest $request) {

        $this->rollBack(function() use($request) {
            $patientProfile = PatientProfile::create($request->only('lname', 'fname', 'mname', 'suffix', 'informant', 'dob', 'gender', 'is_pregnant','contact_no', 'occupation', 'patcstat'));

            $patientProfile->demographic()->create($request->only('brg', 'ctycode', 'provcode', 'patstr', 'regcode', 'patzip'));

            $callLog = $this->callLog->generateCallLog($patientProfile, $request->platform_id || 2);

            $patientChiefComplaint = PatientChiefComplaint::create(
                [
                    'patient_profile_id' => $patientProfile->id,
                    'chief_complaint' => $request->chief_complaint,
                ]
            );

            $encounter = Encounter::create([
                'patient_chief_complaint_id' => $patientChiefComplaint->id,
                'call_log_id' => $callLog->id,
                'patient_condition_id' => $request->patient_condition_id,
                'consultation_status_id' => $request->consultation_status_id
            ]);

        $teleservePatient = TeleservePatient::create([
            'lname' => $request->lname,
            'fname' => $request->fname,
            'mname' => $request->mname,
            'suffix' => $request->suffix,
            'contact_no' => $request->contact_no,
            'patient_profile_id' => $request->id,
            'hpercode' => $request->hpercode
        ]);

        $teleserveDemographic = TeleserveDemographic::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'regcode' => $request->regcode,
            'provcode' => $request->provcode,
            'ctycode' => $request->ctycode,
            'patstr' => $request->patstr,
        ]);

        TeleclerkLog::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'log_datetime' => $request->log_date . ' ' . $request->log_time,
            'platform_id' => 2,
            'informant' => $request->informant,
            'inquiry' => $request->chief_complaint,
            'is_teleconsult' => 1,
            'encounter' => $encounter->id
        ]);


        $this->sendEvent('created', 'New Patient', 'Patient created');

        });
        
        
        return $this->success([], Response::HTTP_CREATED);
    }

    public function update(PatientRequest $request, PatientProfile $patientProfile) {
        $patientProfile->update($request->validated());
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function show(PatientProfile $patientProfile) {
        $data = PatientProfile::find($patientProfile->id);

        $demographic = $patientProfile->demographic;
        if ($demographic) {
            $demographic->setAttribute('regname', $this->getRegionName($demographic->regcode));
            $demographic->setAttribute('provname', $this->getProvinceName($demographic->provcode));
            $demographic->setAttribute('ctyname', $this->getCityName($demographic->ctycode));
            $demographic->setAttribute('bgyname', $this->getBrgName($demographic->brg));
        }

        return $this->success([
            'patient_profile' => $data,
            'demographics' => $demographic,
            'chief_complaints' => $patientProfile->patientChiefComplaint
        ], Response::HTTP_OK);
    }

    public function destroy(PatientProfile $patientProfile) {
        $patientProfile->delete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }


    public function schedules(Request $request) {
        $startAt = $request->has('start_at') ? $request->start_at : now()->format("Y-m-d");
        $endAt = $request->has('end_at') ? $request->end_at : now()->format("Y-m-d");
        $departmentId = $request->has('department_id') ? $request->department_id : null;

        return PatientSchedule::whereBetween('schedule_date', [$startAt, $endAt])
        ->when($departmentId, function($query) use($departmentId) {
            $query->where('users.department_id', $departmentId);
        })
        ->join('users','patient_schedules.user_id', '=', 'users.id')
        ->get();
    }

    public function cloneToTelehealth(PatientRequest $request, string $hpercode) {
        $hperson = Hperson::where('hpercode', $hpercode)->first();

        if (!$hperson) return response()->json(['message' => "No record found"], 422);

        $patientProfileId = $hperson->patientClone($request->contact_no, $request->occupation);

        $patientProfile = PatientProfile::find($patientProfileId);

        Demographic::firstOrNew([
            'patient_profile_id' => $patientProfileId
        ])
        ->fill([
            'regcode' => $request->regcode,
            'provcode' => $request->provcode,
            'ctycode' => $request->ctycode,
            'bgycode' => $request->bgycode,
            'patstr' => $request->patstr ? $request->patstr : "",
            'patzip' => $request->patzip ? $request->patzip : "",
        ])
        ->save();

        $callLog = $this->callLog->generateCallLog($patientProfile, 2);

        $data = PatientChiefComplaint::create([
            'chief_complaint' => $request->chief_complaint,
            'patient_profile_id' => $patientProfileId
        ]);

        $encounter = $data->encounter()->create([
            'is_follow_up' => 0,
            'is_active' => 1,
            'call_log_id' => $callLog->id,
            'patient_condition_id' => $request->patient_condition_id,
            'consultation_status_id' => $request->consultation_status_id
        ]);

        $teleservePatient = TeleservePatient::create([
            'lname' => $patientProfile->lname,
            'fname' => $patientProfile->fname,
            'mname' => $patientProfile->mname,
            'suffix' => $patientProfile->suffix,
            'contact_no' => $patientProfile->contact_no,
            'patient_profile_id' => $patientProfile->id,
            'hpercode' => $patientProfile->hpercode
        ]);

        $teleserveDemographic = TeleserveDemographic::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'regcode' => $patientProfile->demographic->regcode,
            'provcode' => $patientProfile->demographic->provcode,
            'ctycode' => $patientProfile->demographic->ctycode,
            'patstr' => $patientProfile->demographic->patstr,
        ]);

        TeleclerkLog::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'log_datetime' => now()->format("Y-m-d H:i:s"),
            'platform_id' => 2,
            'informant' => $request->informant,
            'inquiry' => $request->chief_complaint,
            'is_teleconsult' => 1,
            'encounter' => $encounter->id
        ]);

        // TeleclerkLog::create([
        //     'log_datetime' => now()->format("Y-m-d H:i:s"),
        //     'platform_id' => 2,
        //     'informant' => $request->informant,
        //     'inquiry' => $request->chief_complaint,
        //     'patient_lname' => $patientProfile->lname,
        //     'patient_fname' => $patientProfile->fname,
        //     'patient_mname' => $patientProfile->mname,
        //     'patient_suffix' => $patientProfile->suffix,
        //     'patient_profile_id' => $patientProfile->id,
        //     'patient_contact_no' => $patientProfile->contact_no,
        //     'regcode' => $patientProfile->demographic->regcode,
        //     'provcode' => $patientProfile->demographic->provcode,
        //     'ctycode' => $patientProfile->demographic->ctycode,
        //     'patstr' => $patientProfile->demographic->patstr,
        //     'is_teleconsult' => 1
        // ]);

        $patientName = $patientProfile->name;
        $this->sendEvent('created', 'New Consultation', $patientName . ' has new consultation encoded');

        return $this->success(['id' => $patientProfileId], Response::HTTP_OK);
    }

    public function cloneToTelehealthAppointment(PatientRequest $request, string $hpercode) {
        $hperson = Hperson::where('hpercode', $hpercode)->first();

        if (!$hperson) return response()->json(['message' => "No record found"], 422);

        // $patientProfileId = $hperson->patientClone($request->contact_no, $request->occupation);

        // $patientProfile = PatientProfile::find($patientProfileId);

        // Demographic::firstOrNew([
        //     'patient_profile_id' => $patientProfileId
        // ])
        // ->fill([
        //     'regcode' => $request->regcode,
        //     'provcode' => $request->provcode,
        //     'ctycode' => $request->ctycode,
        //     'bgycode' => $request->bgycode,
        //     'patstr' => $request->patstr ? $request->patstr : "",
        //     'patzip' => $request->patzip ? $request->patzip : "",
        // ])
        // ->save();

        // $callLog = $this->callLog->generateCallLog($patientProfile, 2);

        // $data = PatientChiefComplaint::create([
        //     'chief_complaint' => $request->chief_complaint,
        //     'patient_profile_id' => $patientProfileId
        // ]);

        // $encounter = $data->encounter()->create([
        //     'is_follow_up' => 0,
        //     'is_active' => 1,
        //     'call_log_id' => $callLog->id,
        //     'patient_condition_id' => $request->patient_condition_id,
        //     'consultation_status_id' => $request->consultation_status_id
        // ]);

        $teleservePatient = TeleservePatient::create([
            'lname' => $hperson->patlast,
            'fname' => $hperson->patfirst,
            'mname' => $hperson->patmiddle,
            'suffix' => $hperson->patsuffix,
            'contact_no' => $request->contact_no,
            'hpercode' => $hpercode
        ]);

        $teleserveDemographic = TeleserveDemographic::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'regcode' => $request->regcode,
            'provcode' => $request->provcode,
            'ctycode' => $request->ctycode,
            'bgycode' => $request->bgycode,
            'patstr' => $request->patstr,
        ]);

        TeleclerkLog::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'log_datetime' => now()->format("Y-m-d H:i:s"),
            'platform_id' => 2,
            'informant' => $request->informant,
            'inquiry' => "OPD APPOINTMENT",
            'is_teleconsult' => 0,
        ]);

        PatientSchedule::create([
            'appointmentable_type' => 'App\\Models\\TeleservePatient',
            'appointmentable_id' => $teleservePatient->id,
            'schedule_status_id' => 1,
            'schedule_datetime' => $request->schedule_datetime,
            'reason' => "OPD Appointment",
            'department_id' => $request->department_id,
            'user_id' => auth()->id()
        ]);


        $patientName = $teleservePatient->lname . ', '. $teleservePatient->fname . ' ' . $teleservePatient->mname;
        $this->sendEvent('created', 'Patient Schedule', $patientName . ' is already scheduled');

        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function bindToTelehealth(Request $request, PatientProfile $patientProfile, string $hpercode) {
        $hperson = Hperson::where('hpercode', $hpercode)->first();

        if (!$hperson) return response()->json(['message' => "No record found"], 422);

        $haddr = Haddr::where('addstat', 'A')->first();

        $patientProfile->demographic()->create([
            'brg' => $haddr->brg,
            'ctycode' => $haddr->ctycode,
            'provcode' => $haddr->provcode,
            'patstr' => $haddr->patstr,
            'regcode' => $haddr->region,
            'patzip' => $haddr->patzip
        ]);

        $patientProfile->update(['hpercode' => $hpercode]);

        if ($request->has('encounter_id')) {
            $encounter = Encounter::find($request->encounter_id);

            if ($encounter) {
                HEnct::create([
                    'hpercode' => $hpercode, 
                    'encdate' => $encounter->consultationAssignment->first()->created_at, 
                    'enctime' => $encounter->consultationAssignment->first()->created_at
                ]);
                ForwardToHomis::where('encounter_id', $encounter->id)->update(['sent' => 1, 'user_id' => auth()->id()]);
            }
        }

        return $this->success([], Response::HTTP_NO_CONTENT);
    }



    protected function getCivilStatus($stat) {
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

    public function validatingProfile(string $hpercode) {
        $patientProfile = PatientProfile::where('hpercode', $hpercode)->first();
        $homisProfile = Hperson::where('hperson.hpercode', $hpercode)
        ->leftJoin('haddr', function($join) {
            $join->on('hperson.hpercode', '=', 'haddr.hpercode')
            ->where('addstat', 'A');
        })
        ->leftJoin('hbrgy', 'haddr.brg', '=', 'hbrgy.bgycode')
        ->leftJoin('hcity', 'haddr.ctycode', '=', 'hcity.ctycode')
        ->leftJoin('hprov', 'haddr.provcode', 'hprov.provcode')
        ->leftJoin('hregion', 'hprov.provreg', '=', 'hregion.regcode')
        ->select(
            'hperson.hpercode', 
            'patlast AS lname', 
            'patfirst AS fname', 
            'patmiddle AS mname', 
            DB::raw("CASE WHEN patsex = 'M' THEN 'Male' ELSE 'Female' END AS gender"), 
            DB::raw("CONVERT(char(10), patbdate,126) AS dob"),
            'haddr.brg',
            'haddr.ctycode',
            'haddr.provcode',
            'hbrgy.bgyname',
            'hcity.ctyname',
            'hprov.provname',
            'hregion.regcode',
            'hregion.regname'
        )
        ->first();
        return response()->json([
            'cloned' => $patientProfile!= null ? 1 : 0, 
            'id' => $patientProfile!=null ? $patientProfile->id : null,
            'homis_profile' => $homisProfile,
        ], 200);
    }

    public function homisPatient(string $hpercode) {
        $hperson = Hperson::where('hpercode', $hpercode)->first();
        $haddr = Haddr::where('hpercode', $hpercode)
        ->leftJoin('hbrgy', 'haddr.brg', '=', 'hbrgy.bgycode')
        ->leftJoin('hcity', 'haddr.ctycode', '=', 'hcity.ctycode')
        ->leftJoin('hprov', 'haddr.provcode', 'hprov.provcode')
        ->leftJoin('hregion', 'hprov.provreg', '=', 'hregion.regcode')
        ->select(
            'haddr.*',
            'haddr.brg',
            'haddr.ctycode',
            'haddr.provcode',
            'hbrgy.bgyname',
            'hcity.ctyname',
            'hprov.provname',
            'hregion.regcode',
            'hregion.regname'
        )
        ->first();
        if ($hpercode) 
            return ['hperson' => $hperson, 'demographic' => $haddr];
    }

    public function storeAppointment(Request $request) {

        $teleservePatient = TeleservePatient::create([
            'lname' => $request->lname,
            'fname' => $request->fname,
            'mname' => $request->mname,
            'suffix' => $request->suffix,
            'contact_no' => $request->contact_no,
        ]);

        PatientSchedule::create([
            'user_id' => auth()->id(),
            'schedule_datetime' => date('Y-m-d H:i:s', strtotime($request->schedule_datetime)),
            'schedule_status_id' => 1,
            'reason' => 'OPD Appointment',
            'department_id' => $request->department_id,
            'appointmentable_type' => 'App\Models\TeleservePatient',
            'appointmentable_id' => $teleservePatient->id
        ]);


         $this->sendEvent('created', 'OPD Appointment', 'Appointment is already created');

        return $this->success([], Response::HTTP_NO_CONTENT);
    }
    
}
