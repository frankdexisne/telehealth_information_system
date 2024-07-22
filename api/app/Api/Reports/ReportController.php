<?php

namespace App\Api\Reports;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{Department, PatientChiefComplaint, ConsultationFollowUp, Encounter, TeleclerkLog};
use App\Models\HOMIS\HCity;

class ReportController extends ApiController
{
    public function __construct(Department $department) {
        $this->modelQuery = $department->query();
        $this->model = $department;
    }

    public function index(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        
        $paginator = $this->modelQuery
            ->where('is_doctor', 1)
            ->when($request, function ($query) use ($request) {
                $query->where('name', 'LIKE', $request->name . "%");
            })
            ->paginate($pageSize);

        $items = $paginator->getCollection();

        $yearMonth = $request->has('year_month') ? $request->year_month : now()->format("Y-m");

        $modifiedItems = $items->map(function ($item) use($yearMonth){
            $item['consulted'] = $this->getConsulted($item['id'], $yearMonth)->count();
            $item['unconsulted'] = $this->getUnconsulted($item['id'], $yearMonth)->count();
            return $item;
        })->filter(function($item) {
            return $item['consulted'] > 0 || $item['unconsulted'] > 0;
        })->values();
        return $paginator->setCollection($modifiedItems);
    }

    public function teleserveStatus(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;
        
        $paginator = $this->modelQuery
            ->where('is_doctor', 1)
            ->when($request, function ($query) use ($request) {
                $query->where('name', 'LIKE', $request->name . "%");
            })
            ->paginate($pageSize);

        $items = $paginator->getCollection();

        $yearMonth = $request->has('year_month') ? $request->year_month : now()->format("Y-m");

        $modifiedItems = $items->map(function ($item) use($yearMonth){
            $item['consulted'] = $this->getConsulted($item['id'], $yearMonth)->count();
            $item['teleserve'] = $this->getTeleservice($item['id'], $yearMonth)->count();
            return $item;
        })->filter(function($item) {
            return $item['consulted'] > 0 || $item['teleserve'] > 0;
        })->values();

        return $paginator->setCollection($modifiedItems);
    }

    public function teleconsultationStatus($yearMonth) {
        $departments = Department::where('is_doctor', 1)
        ->get()
        ->map(function($item) use($yearMonth) {
            $item['consulted'] = $this->getConsulted($item['id'], $yearMonth)->count();
            $item['unconsulted'] = $this->getUnconsulted($item['id'], $yearMonth)->count();
            return $item;
        });
    }

    protected function getConsulted($departmentId, $yearMonth) {
        $yearMonthSplit = explode('-', $yearMonth);

        $year = $yearMonthSplit[0];
        $month = $yearMonthSplit[1];

        return Encounter::whereYear('encounters.created_at', $year)
        ->whereMonth('encounters.created_at', $month)
        ->whereHas('consultationAssignment', function($query) use($departmentId) {
            $query->join('users', 'consultation_assignments.doctor_id', '=', 'users.id')
            ->where('users.department_id', $departmentId);
        });
    }

    protected function getUnconsulted($departmentId, $yearMonth) {
        $yearMonthSplit = explode('-', $yearMonth);

        $year = $yearMonthSplit[0];
        $month = $yearMonthSplit[1];

        return Encounter::whereYear('encounters.created_at', $year)
        ->whereMonth('encounters.created_at', $month)
        ->whereHas('departmentAssignment', function($query) use ($departmentId){
            $query->where('department_assignments.department_id', $departmentId);
        })
        ->whereDoesntHave('consultationAssignment');
    }

    public function getTeleservice($departmentId, $yearMonth) {
        $yearMonthSplit = explode('-', $yearMonth);

        $year = $yearMonthSplit[0];
        $month = $yearMonthSplit[1];

        return TeleclerkLog::whereYear('teleclerk_logs.created_at', $year)
        ->whereMonth('teleclerk_logs.created_at', $month);
    }

    public function demographicsStatus(Request $request) {
        
        $yearMonth = $request->has('year_month') ? $request->year_month : now()->format("Y-m");

        $teleclerkLogsCtyCodes = TeleclerkLog::where('is_teleconsult', 0)
        ->whereYear('log_datetime', $yearMonth[0])
        ->whereMonth('log_datetime', $yearMonth[1])
        ->groupBy('ctycode')
        ->pluck('ctycode')
        ->toArray();

        $paginator = HCity::whereIn('ctycode', $teleclerkLogsCtyCodes)
            ->when($request, function ($query) use ($request) {
                $query->where('ctyname', 'LIKE', $request->name . "%");
            })
            ->paginate($pageSize);

        $modifiedItems = $items->map(function ($item) use($yearMonth){
            $item['count'] = $this->getTeleserviceLocationCount($item['ctycode'], $yearMonth)->count();
            return $item;
        });

        return $paginator->setCollection($modifiedItems);
    }

    protected function getTeleserviceLocationCount($ctyCode, $yearMonth) {
        $yearMonth = explode('-', $yearMonth);
        return TeleclerkLog::where('ctycode', $ctyCode)
        ->whereYear('log_datetime', $yearMonth[0])
        ->whereMonth('log_datetime', $yearMonth[1])
        ->count();
    }

    protected function getTeleserviceLocationUndefined($yearMonth) {
        $yearMonth = explode('-', $yearMonth);
        return TeleclerkLog::whereNull('ctycode')
        ->whereYear('log_datetime', $yearMonth[0])
        ->whereMonth('log_datetime', $yearMonth[1])
        ->count();
    }
}
