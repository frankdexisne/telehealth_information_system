<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
{
    protected $route;

    public function __construct() {
        $this->route = $route = app('request')->route(); 
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
            case 'roles.store': return $this->storeRules();
            case 'roles.update': return $this->updateRules();
            default : [];   
        }
    }

    protected function storeRules(): array
    {
        return [
            'name' => [
                'required',
                'unique:roles'
            ]
        ];
    }

    protected function updateRules(): array
    {
        
        return [
            'name' => [
                'required',
                Rule::unique('roles')
                ->ignore($this->route->parameter('role'))
            ]
        ];
    }
}
 