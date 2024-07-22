<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdministrationRequest extends FormRequest
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
            case 'departments.store': return $this->departmentRules()['store'];
            case 'departments.update': return $this->departmentRules()['update'];
            case 'designations.store': return $this->designationRules()['store'];
            case 'designations.update': return $this->designationRules()['update'];
            case 'dispositions.store': return $this->dispositionRules()['store'];
            case 'dispositions.update': return $this->dispositionRules()['update'];
            case 'services.store': return $this->serviceRules()['store'];
            case 'services.update': return $this->serviceRules()['update'];
            default : [];   
        }
    }

    protected function departmentRules(): array
    {
        return [
            'store' => [
                'name' => ['required', 'unique:departments'],
            ],
            'update' => [
                'name' => [
                    'required',
                    Rule::unique('departments')
                    ->ignore($this->route->parameter('department'))
                ]
            ]
        ];
    }

    protected function designationRules(): array
    {
        return [
            'store' => [
                'name' => ['required', 'unique:designations'],
            ],
            'update' => [
                'name' => [
                    'required',
                    Rule::unique('designations')
                    ->ignore($this->route->parameter('designation'))
                ]
            ]
        ];
    }

    protected function dispositionRules(): array
    {
        return [
            'store' => [
                'name' => ['required', 'unique:dispositions'],
            ],
            'update' => [
                'name' => [
                    'required',
                    Rule::unique('dispositions')
                    ->ignore($this->route->parameter('disposition'))
                ]
            ]
        ];
    }

    protected function serviceRules(): array
    {
        return [
            'store' => [
                'name' => ['required', 'unique:services'],
            ],
            'update' => [
                'name' => [
                    'required',
                    Rule::unique('services')
                    ->ignore($this->route->parameter('service'))
                ]
            ]
        ];
    }
}
