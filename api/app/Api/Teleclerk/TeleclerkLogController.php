<?php

namespace App\Api\Teleclerk;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{TeleclerkLog, TeleservePatient, TeleserveDemographic};
use App\Http\Requests\PatientRequest;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\{ WebSocketTrait};

class TeleclerkLogController extends ApiController
{
    use WebsocketTrait;

    public function __construct(TeleclerkLog $teleclerkLog) {
        $this->modelQuery = $teleclerkLog->query()->join('platforms', 'teleclerk_logs.platform_id', '=', 'platforms.id')
        ->select('teleclerk_logs.*', 'platforms.name AS platform_name');
        $this->model = $teleclerkLog;
    }

    protected function searchHandler($query, Request $request) {
        $logDate = $request->has('log_date') ? $request->log_date : null;
        $query->when($logDate, function($query) use($logDate) {
            $query->whereDate('log_datetime', $logDate);
        });
    }

    public function store(PatientRequest $request) {

        // $data = TeleclerkLog::create([
        //     'log_datetime' => $request->log_date . ' ' . $request->log_time,
        //     'platform_id' => $request->platform_id,
        //     'informant' => $request->informant,
        //     'inquiry' => $request->inquiry,
        //     'patient_lname' => $request->lname,
        //     'patient_fname' => $request->fname,
        //     'patient_mname' => $request->mname,
        //     'patient_suffix' => $request->suffix,
        //     'patient_contact_no' => $request->contact_no,
        //     'regcode' => $request->regcode,
        //     'provcode' => $request->provcode,
        //     'ctycode' => $request->ctycode,
        //     'patstr' => $request->patstr,
        //     'is_teleconsult' => 0
        // ]);

        $teleservePatient = TeleservePatient::create([
            'lname' => $request->lname,
            'fname' => $request->fname,
            'mname' => $request->mname,
            'suffix' => $request->suffix,
            'contact_no' => $request->contact_no,
        ]);

        if ($request->has('regcode') || $request->has('provcode') || $request->has('ctycode') || $request->has('patstr')) {
            $teleserveDemographic = TeleserveDemographic::create([
                'teleserve_patient_id' => $teleservePatient->id,
                'regcode' => $request->regcode,
                'provcode' => $request->provcode,
                'ctycode' => $request->ctycode,
                'patstr' => $request->patstr,
            ]);
        }
        

        $data = TeleclerkLog::create([
            'teleserve_patient_id' => $teleservePatient->id,
            'log_datetime' => $request->log_date . ' ' . $request->log_time,
            'platform_id' => $request->platform_id,
            'informant' => $request->informant,
            'inquiry' => $request->inquiry,
            'is_teleconsult' => 0,
        ]);

        $this->sendEvent('created', 'Inquiry', 'Inquiry is already saved');

        return $this->success(['data' => $data], Response::HTTP_CREATED);
    }

    public function update(PatientRequest $request, TeleclerkLog $teleclerkLog) {
        $teleclerkLog->update($request->validated());
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function destroy(TeleclerkLog $teleclerkLog) {
        $teleclerkLog->delete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }
}
