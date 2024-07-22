<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Enums\ApiErrorCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Closure;
use DB;
use Illuminate\Support\Facades\Log;

class ApiController extends Controller
{
    protected $modelQuery;

    protected $model;

    protected function success(?array $data, int $statusCode, array $headers = []): JsonResponse
    {
        $data = $data ?? [];

        $results = array_merge(['success' => true], $data);

        return response()->json($results, $statusCode, $headers);
    }

    protected function validateRequest(array $request, array $rules) {
        $validation = Validator::make($request, $rules);

        if ($validation->fails()) {
            return response()->json(['errors' => $validation->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return;
    }

    /**
     * Return a formatted JSON error response
     */
    protected function error(
        string $message,
        int $statusCode,
        ApiErrorCode $errorCode = null,
        array $errors = [],
        array $headers = []
    ): JsonResponse {
        $results = [
            'success' => false,
            'error_code' => $errorCode,
            'error_message' => $message,
        ];

        if (! empty($errors)) {
            $results['errors'] = $errors;
        }

        return response()->json($results, $statusCode, $headers);
    }

    public function index(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        
        return $this->modelQuery
            ->when($request, function ($query) use ($request) {
                $this->searchHandler($query, $request);
            })
            ->paginate($pageSize);
    }

    protected function searchHandler($query, Request $request) {
        return $query;
    }

    public function rollBack(Closure $next) {
        return DB::transaction(function() use($next) {
            try {
                return $next();
            } catch (\Exception $e) {
                DB::rollback();
                Log::error('An error occurred: ' . $e->getMessage());
            }
        });
    }
}
