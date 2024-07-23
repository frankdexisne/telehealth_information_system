<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PatientChiefComplaintRequest extends FormRequest
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
            case 'patient-chief-complaints.store': return $this->storeRules();
            case 'patient-chief-complaints.update': return $this->updateRules();
            default : [];   
        }
    }

    public function storeRules() {
        return [
            'regcode' => [
                'required'
            ],
            'provcode' => [
                'required'
            ],
            'ctycode' => [
                'required'
            ],
            'bgycode' => [
                'required'
            ],
            'patstr' => [
                'nullable'
            ],
            'patzip' => [
                'nullable'
            ],
            'platform_id' => [
                'required',
                'exists:platforms,id'
            ],
            'chief_complaint' => [
                'required'
            ],
            'consultation_status_id' => [
                'required',
                'exists:consultation_statuses,id'
            ],
            'patient_condition_id' => [
                'required',
                'exists:patient_conditions,id'
            ]
        ];
    }

    public function updateRules() {
        return [
            'chief_complaint' => [
                'required'
            ],
            'patient_status_id' => [
                'required',
                'exists:patient_statuses,id'
            ],
            'patient_condition_id' => [
                'required',
                'exists:patient_conditions,id'
            ]
        ];
    }

    public function followUpRules() {
        return [
            'regcode' => [
                'required'
            ],
            'provcode' => [
                'required'
            ],
            'ctycode' => [
                'required'
            ],
            'bgy' => [
                'required'
            ],
            'patstr' => [
                'nullable'
            ],
            'patzip' => [
                'nullable'
            ],
            'platform_id' => [
                'required',
                'exists:platforms,id'
            ],
        ];
    }
}
