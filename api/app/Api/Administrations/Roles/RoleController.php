<?php

namespace App\Api\Administrations\Roles;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Http\Requests\RoleRequest;
use Spatie\Permission\Models\Role;
use App\Models\Module;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class RoleController extends ApiController
{
    public function __construct(Role $role) {
        $this->modelQuery = $role->query();
        $this->model = $role;
    }

    protected function searchHandler($query, Request $request) {
        return $query->where('name', 'LIKE', $request->name . "%");
    }

    public function store(RoleRequest $request) {
        $data = $this->model->create([
            'name' => $request->name,
            'display_name' => $request->name,
            'guard_name' => 'web'
        ]);
        $permissions = $request->has('permission') ? $request->permission : [];
        $data->syncPermissions($permissions);
        return $this->success(['data' => $data], Response::HTTP_CREATED);
    }

    public function update(RoleRequest $request, Role $role) {
        $role->update([
            'name' => $request->name,
            'display_name' => $request->name,
        ]);
        $permissions = $request->has('permission') ? $request->permission : [];
        $role->syncPermissions($permissions);
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function get(Role $role) {
        return $this->success(['data' => $role], Response::HTTP_OK);
    }

    public function destroy(Role $role) {
        $role->delete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function permissionList(Request $request) {
        $roleId = $request->has('role_id') ? $request->role_id : null;
        return Module::with(['permission' => function($query) use($request){
            $roleId = $request->has('role_id') ? $request->role_id : null;
            if ($roleId) {
                $query->leftJoin('role_has_permissions', function($join) use($roleId){
                    $join->on('permissions.id', '=', 'role_has_permissions.permission_id')
                    ->where('role_has_permissions.role_id', $roleId);
                })
                ->select(['permissions.*', DB::raw("CASE WHEN role_has_permissions.permission_id IS NULL THEN 0 ELSE 1 END AS granted")]);
            } else {
                $query->select('permissions.*');
            }
        }])
        ->get();
    }
}
