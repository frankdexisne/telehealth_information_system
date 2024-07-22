<?php

namespace App\Api\Administrations\Departments;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Http\Requests\AdministrationRequest;
use Symfony\Component\HttpFoundation\Response;

class DepartmentController extends ApiController
{
    public function __construct(Department $department) {
        $this->modelQuery = $department->query()->with('day');
        $this->model = $department;
    }

    protected function searchHandler($query, Request $request) {
        $name = $request->has('name') ? $request->name : null;
        $isDoctor = $request->has('is_doctor') ? (int)$request->is_doctor : null;
        return $query
        ->when($name, function($query) use($name) {
            $query->where('name', 'LIKE', $request->name . "%");
        })
        ->when($isDoctor, function($query) use($isDoctor) {
            $query->where('is_doctor', $isDoctor);
        });
    }

    public function store(AdministrationRequest $request) {
        $data = $this->model->create($request->validated());
        return $this->success(['data' => $data], Response::HTTP_CREATED);
    }

    public function update(AdministrationRequest $request, Department $department) {
        $department->update($request->validated());
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function destroy(Department $department) {
        $department->delete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }
}
