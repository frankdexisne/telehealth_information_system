<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Closure;
use Hash;

class AuthRequest extends FormRequest
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
            case 'auth.login': return $this->loginRules();
            case 'auth.changePassword': return $this->changePasswordRule();
            default : [];   
        }
    }

    protected function loginRules(): array
    {
        return [
            'email' => [
                'required', 
                'email'
            ],
            'password' => [
                'required', 
                function(string $attribute, mixed $value, Closure $fail) {
                    if (!auth()->attempt(['email' => $this->input('email'), 'password' => $this->input('password')])){
                        $fail("Invalid username and password");
                    }
                }
            ]
        ];
    }

    protected function changePasswordRule(): array
    {
        return [
            'password' => [
                'required', 
                'min:5', 
                function(string $attribute, mixed $value, Closure $fail) {
                    if(!Hash::check($value, auth()->user()->password)) {
                        $fail("Invalid password");
                    }
                }
            ],
            'new_password' => ['required', 'min:5', 'confirmed'],
        ];
    }
}
