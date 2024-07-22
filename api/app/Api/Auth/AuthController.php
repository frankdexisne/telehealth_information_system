<?php

namespace App\Api\Auth;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\ApiErrorCode;
use Illuminate\Support\Facades\Validator;
use App\Models\Category;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\AuthRequest;
use Illuminate\Http\JsonResponse;

class AuthController extends ApiController
{
    public function login(AuthRequest $request): JsonResponse 
    {
        $user = auth()->user();
        $role = $user->roles[0];
        $roleName = $role ? $role->name : null;
        $permissions = $role ? $role->permissions->pluck('name')->toArray() : [];

        return $this->success([
            'data' => [
                'user' => $user,
                'token' => $user->createToken('auth_token')->plainTextToken,
                'role_name' => $roleName,
                'permissions' => $permissions ? $permissions : [],
            ]
        ], Response::HTTP_OK, ['application/json']);
    }

    public function changePassword(AuthRequest $request) {
        $result = $this->rollBack(function() use($request) {
            auth()->user()->update(['password' => $request->new_password]);
            return [
                'success' => true
            ];
        });

        if ($result && $result['success'] == true) {
            return $this->success([], Response::HTTP_NO_CONTENT);
        } else {
            return $this->error("Transaction has been rollback", Response::HTTP_FAILED_DEPENDENCY, ApiErrorCode::DEPENDENCY_ERROR);
        }
    }

    public function user(Request $request) {
        $user = $request->user();
        $role = $user->roles[0];
        $roleName = $role ? $role->name : null;
        $permissions = $role ? $role->permissions->pluck('name')->toArray() : [];

        return $this->success([
            'data' => [
                'user' =>$user,
                'role_name' => $roleName,
                'permissions' => $permissions ? $permissions : [],
            ]   
        ], 
        Response::HTTP_OK);
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
