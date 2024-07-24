<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PatientRequest extends FormRequest
{
    protected $route;

    public function __construct() {
        $this->route = $route = app('request')->route(); 
    }
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $routeName = $this->route->getName();

        return $this->routeCallback($routeName);
    }

    protected function routeCallback($routeName) {
        switch($routeName) {
            case 'patients.store' : return $this->patientStoreRules();
            case 'patients.update': return $this->patientUpdateRules();
            case 'patient-chief-complaints.store': return $this->patientChiefComplaintRules();
            case 'patients.cloneToTelehealth' : return $this->patientHomisToTelehealth();
            case 'demographics.store' : return $this->demographicRules();
            case 'demographics.update' : return $this->demographicRules();
            case 'patient-chief-complaints.completingDemographic' : return $this->demographicRules();
            case 'teleclerk-logs.store' : return $this->teleclerkLogRules();
            case 'teleclerk-logs.update' : return $this->teleclerkLogRules();
            default : [];   
        }
    }

    protected function patientHomisToTelehealth() {
        return [
            'contact_no' => ['required'],
            'occupation' => ['required'],
            'informant' => ['required'],
            'patempstat' => ['required'],
            'chief_complaint' => ['required'],
            'patient_condition_id' => ['required', 'exists:patient_conditions,id'],
            'consultation_status_id' => ['required', 'exists:consultation_statuses,id']
        ];
    }

    protected function patientStoreRules() {
        return [
            'lname' => ['required'],
            'fname' => ['required'],
            'mname' => ['required'],
            'dob' => ['required', 'date'],
            'gender' => ['required'],
            'contact_no' => ['required'],
            'occupation' => ['required'],
            'patcstat' => ['required'],
            'informant' => ['required'],
            'regcode' => ['required'],
            'provcode' => ['required'],
            'ctycode' => ['required'],
            'brg' => ['required'],
            'patstr' => ['nullable'],
            'patzip' => ['nullable'],
            'chief_complaint' => ['required'],
            'patient_condition_id' => ['required', 'exists:patient_conditions,id'],
        ];
    }

    protected function patientChiefComplaintRules(): array
    {
        return [];
    }

    protected function patientUpdateRules() {
        return [];
    }

    protected function demographicRules(): array
    {
        return [
            'regcode' => ['required'],
            'provcode' => ['required'],
            'ctycode' => ['required'],
            'brg' => ['required'],
            'patstr' => ['required'],
            'patzip' => ['required'],
        ];
    }

    protected function teleclerkLogRules() {
        return [
            'log_date' => ['required', 'date'],
            'log_time' => ['required'],
            'informant' => ['required'],
            'patient_lname' => ['nullable'],
            'patient_fname' => ['nullable'],
            'patient_mname' => ['nullable'],
            'patient_suffix' => ['nullable'],
            'patient_contact_no' => ['nullable'],
            'platform_id' => ['required', 'exists:platforms,id'],
            'inquiry' => ['required'],
            'rx' => ['nullable'],
            'remarks' => ['nullable'],
            'update' => ['nullable'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'ctycode' => ['nullable'],
            'brg' => ['nullable'],
            'provcode' => ['nullable'],
            'regcode' => ['nullable'],
            'patstr' => ['nullable'],
            'patzip' => ['nullable']
        ];
    }


    
}
