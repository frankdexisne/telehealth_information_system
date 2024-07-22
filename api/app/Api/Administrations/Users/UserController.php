<?php

namespace App\Api\Administrations\Users;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\UserRequest;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\UserResource;
use DB;

class UserController extends ApiController
{
    public function __construct(User $user) {
        $this->modelQuery = $user->query();
        $this->model = $user;
    }

    public function index(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        $isBind = $request->has('is_bind') ? $request->is_bind : null;

        return $this->modelQuery
            ->when($request, function ($query) use ($request) {
                $this->searchHandler($query, $request);
            })
            ->when($isBind, function($query) use($isBind){
                if ($isBind === 1) {
                    $query->whereNotNull('hpersonal_code');
                } else {
                    $query->whereNull('hpersonal_code');
                }
            })
            ->join('departments', 'users.department_id', '=', 'departments.id')
            ->join('designations', 'users.designation_id', '=', 'designations.id')
            ->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->select('users.*', 'departments.name AS department_name', 'designations.name AS designation_name')
            ->paginate($pageSize);
    }

    protected function searchHandler($query, Request $request) {
        $name = $request->has('name') ? $request->name : null;
        $email = $request->has('email') ? $request->email : null;
        $departmentId = $request->has('department_id') ? $request->department_id : null;
        $designationId = $request->has('designation_id') ? $request->designation_id : null;
        $roleId = $request->has('role_id') ? $request->role_id : null;

        return $query->when($name, function($query) use($name) { $query->where('users.name', 'LIKE', $name . "%"); })
        ->when($email, function($query) use($email) { $query->where('users.email', 'LIKE', $email . "%"); })
        ->when($departmentId, function($query) use($departmentId) { $query->where('users.department_id',  $departmentId); })
        ->when($designationId, function($query) use($designationId) { $query->where('users.designation_id', $designationId); })
        ->when($roleId, function($query) use($roleId) { $query->where('model_has_roles.role_id', $roleId); });
    }

    public function store(UserRequest $request) {
        $data = $this->model->create($request->validated());
        
        return $this->success(['data' => $data], Response::HTTP_CREATED);
    }

    public function show(User $user) {
        return $user;
    }

    public function update(UserRequest $request, User $user) {
        $user->update($request->validated());
        
        $roleId = request('role_id');
        if ($roleId) {
            $hasRole = DB::table('model_has_roles')->where([
                'model_type' => 'App\\Models\\User',
                'model_id' => $user->id,
            ])->count() > 0;

            if ($hasRole) {
                $hasRole = DB::table('model_has_roles')->where([
                    'model_type' => 'App\\Models\\User',
                    'model_id' => $user->id,
                ])->update([
                    'role_id' => $roleId
                ]);
            } else {
                DB::table('model_has_roles')->insert([
                    'model_type' => 'App\\Models\\User',
                    'model_id' => $user->id,
                    'role_id' => $roleId
                ]);
            }
        }
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function destroy(User $user) {
        $user->delete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function linkUser(Request $request, User $user) {
        $user->update(['hpersonal_code' => $request->hpersonal_code]);
        return $this->success([], Response::HTTP_NO_CONTENT);
    }
}
