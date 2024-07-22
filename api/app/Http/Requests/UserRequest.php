<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
            case 'users.store': return $this->userRules()['store'];
            case 'users.update': return $this->userRules()['update'];
            default : [];   
        }
    }

    protected function userRules(): array
    {
        return [
            'store' => [
                'email' => ['required', 'unique:users'],
                'name' => ['required'],
                'password' => ['required', 'confirmed'],
                'department_id' => ['required', 'exists:departments,id'],
                'designation_id' => ['required', 'exists:designations,id'],
                'role_id' => ['required', 'exists:roles,id']
            ],
            'update' => [
                'email' => [
                    'required', 
                    Rule::unique('users')
                    ->ignore($this->route->parameter('user'))
                ],
                'name' => [
                    'required'
                ],
                'department_id' => ['required', 'exists:departments,id'],
                'designation_id' => ['required', 'exists:designations,id'],
                'role_id' => ['required', 'exists:roles,id']
            ]
        ];
    }
}
