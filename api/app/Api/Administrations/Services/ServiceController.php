<?php

namespace App\Api\Administrations\Services;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Http\Requests\AdministrationRequest;
use App\Models\Service;
use Symfony\Component\HttpFoundation\Response;

class ServiceController extends ApiController
{
    public function __construct(Service $service) {
        $this->modelQuery = $service->query();
        $this->model = $service;
    }

    protected function searchHandler($query, Request $request) {
        return $query->where('name', 'LIKE', $request->search . "%");
    }

    public function store(AdministrationRequest $request) {
        $data = $this->model->create($request->validated());
        return $this->success(['data' => $data], Response::HTTP_CREATED);
    }

    public function update(AdministrationRequest $request, Service $service) {
        $service->update($request->validated());
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function destroy(Service $service) {
        $service->delete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }
}
