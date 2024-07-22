<?php

namespace App\Api\Patients;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\{PatientSchedule, Department};
use DB;
use Symfony\Component\HttpFoundation\Response;
use Carbon\{Carbon, CarbonPeriod};

class PatientScheduleController extends ApiController
{
    public function __construct(PatientSchedule $patientSchedule) {
        $this->modelQuery = $patientSchedule->query()
        ->join('patient_profiles', 'patient_schedules.patient_profile_id', '=', 'patient_profiles.id')
        ->select('patient_profiles.id', DB::raw("CONCAT(patient_profiles.lname, ' ', patient_profiles.fname) AS title"), DB::raw("DATE_FORMAT(patient_schedules.schedule_datetime, '%Y-%m-%d') AS date"))
        ->groupBy('patient_profiles.id', DB::raw("DATE(patient_schedules.schedule_datetime)"), 'title')
        ->orderBy('schedule_datetime')
        ->orderBy('patient_profiles.lname');
        $this->model = $patientSchedule;
    }

    public function index(Request $request) {
        $monthYear = $request->has('month_year') ? $request->month_year : now()->format("Y-m");
        return $this->modelQuery
            ->get();
    }

    public function update(Request $request, PatientSchedule $patientSchedule) {
        $patientChiefComplaint->update(['schedule_datetime' => date('Y-m-d H:i:s', strtotime($request->schedule_datetime))]);
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function destroy(PatientProfile $patientProfile) {
        $patientProfile->delete();
        return $this->success([], Response::HTTP_NO_CONTENT);
    }

    public function departmentSchedule(Request $request) {

        // $deparmentIds = DepartmentAssignment::whereDate('patient_schedules.schedule_datetime', date('Y-m-d', strtotime($request->schedule_datetime)))
        // ->join('encounters', 'department_assignments.encounter_id', '=', 'encounters.id')
        // ->join('patient_schedules', 'encounters.id', '=', 'patient_schedules.encounter_id')
        // ->pluck('department_id');

        // return PatientSchedule::whereDate('schedule_datetime', date("Y-m-d", strtotime($request->schedule_date)))
        // ->leftJoin('encounters', 'patient_schedules.encounter_id', '=', 'encounters.id')
    }

    public function getSchedules(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 10;

        return PatientSchedule::when($request, function ($query) use ($request) {
            if ($request->has('date')) {
                $query->whereDate('schedule_datetime', $request->date);
            }
        })
        ->join('patient_profiles','patient_schedules.patient_profile_id', '=', 'patient_profiles.id')
        ->leftJoin('encounters', 'patient_schedules.encounter_id', '=', 'encounters.id')
        ->leftJoin('patient_chief_complaints', 'encounters.patient_chief_complaint_id', '=', 'patient_chief_complaints.id')
        ->leftJoin('department_assignments', 'encounters.id', 'department_assignments.encounter_id')
        ->leftJoin('departments', 'department_assignments.department_id', '=', 'departments.id')
        ->select('patient_schedules.*', 'patient_profiles.lname', 'patient_profiles.fname', 'patient_profiles.mname', 'patient_profiles.dob', 'patient_profiles.gender', 'departments.name AS department_name', 'patient_chief_complaints.chief_complaint', 'encounters.is_follow_up')
        ->paginate($pageSize);
    }

    public function getCalendarSchedule(Request $request) {
        $date = $request->has('date') ? $request->date : now()->format('Y-m-d');
        $month = $request->has('date') ? date('m', strtotime($request->date)) : now()->format('m');
        $year = $request->has('date') ? date('Y', strtotime($request->date)) : now()->format('Y');

        return PatientSchedule::whereMonth('schedule_datetime', $month)
        ->whereYear('schedule_datetime', $year)
        ->select([
            DB::raw('CONCAT(DATE(schedule_datetime), " 09:30:00") as startDate'),
            DB::raw('CONCAT(DATE(schedule_datetime), " 11:30:00") as endDate'),
        ])
        ->groupBy('startDate')
        ->get()
        ->map(function($item, $index) {
            $item->id = $index;
            $item->title = "Scheduled";
            $item->departments = Department::where('is_doctor', 1)
            ->whereHas('patientSchedule', function($query) use($item) {
                $query->whereDate('schedule_datetime', date('Y-m-d', strtotime($item->startDate)));
            })
            ->select('id', 'name')
            ->get()
            ->map(function($department) use($item) {
                $department->scheduled = $this->getDailyDepartmentSchedules($department->id, date('Y-m-d', strtotime($item->startDate)), true);
                return $department;
            });
            return $item;
        })
        ->filter(function($query) {
            return $query->departments->count() > 0;
        })
        ->values();
    }

    public function getDailyDepartmentSchedules($departmentId, $date, $count = false) {
        $patientSchedule = PatientSchedule::where('department_id', $departmentId)
        ->whereDate('schedule_datetime', $date);

        if ($count) {
            return $patientSchedule->count();
        }

        return $patientSchedule->with('appointmentable')->get();
    }

    // public function getDepartmentPatientSchedules(Request $request) {
    //     $departmentId = $request->has('department_id') ? $request->department_id : null;
    //     $date = $request->has('date') ? $request->date : now()->format('Y-m-d'); 
    //     return PatientSchedule::where('department_id', $departmentId)
    //     ->whereDate('schedule_datetime', $date)
    //     ->with('appointmentable')
    //     ->get();
    // }

    // public function getDailyPatientSchedules(Request $request) {
    //     $date = $request->has('date') ? $request->date : now()->format('Y-m-d');
    //     return Department::where('is_doctor', 1)
    //         ->whereHas('patientSchedule', function($query) use($date) {
    //             $query->whereDate('schedule_datetime', date('Y-m-d', strtotime($date)));
    //         })
    //         ->select('id', 'name')
    //         ->get()
    //         ->map(function($department) use($date) {
    //             $department->patients = $this->getDailyDepartmentSchedules($department->id, $date);
    //             return $department;
    //         });
    // }

    // public function getPatientSchedule(Request $request) {
    //     $departmentId = $request->has('department_id') ? $request->department_id : null;
    //     $date = $request->has('date') ? $request->date : now()->format('Y-m-d');
    //     $month = $request->has('date') ? date('m', strtotime($request->date)) : now()->format('m');
    //     $year = $request->has('date') ? date('Y', strtotime($request->date)) : now()->format('Y');

    //     return $this->getDepartmentSchedules($departmentId, $month, $year, false);
    // }

    // protected function getDepartmentSchedules($departmentId, $month, $year, $getCount = true) {
    //     $patientSchedules = PatientSchedule::where('department_id', $departmentId)
    //     ->whereMonth('schedule_datetime', $month)
    //     ->whereYear('schedule_datetime', $year);

    //     if ($getCount) {
    //         return $patientSchedules->count();
    //     }

    //     return $patientSchedules->get();
    // }

    // public function departmentDailySchedule(Request $request) {
    //     $departmentId = $request->has('department_id') ? $request->department_id : null;
    //     $date = $request->has('date') ? $request->date : now()->format('Y-m-d');
    //     return $this->getDailyDepartmentSchedules($departmentId, $date);
    // }

    // protected function getDailyDepartmentSchedules($departmentId, $date, $getCount = false) {
    //     $patientSchedule =PatientSchedule::where('department_id', $departmentId)
    //     ->whereDate('schedule_datetime', $date);

    //     if ($getCount) {
    //         return $patientSchedule->count();
    //     }

    //     return $patientSchedule->with('appointmentable')->get();
    // }

    // public function dailySchedules($date) {
    //     return Department::where('is_doctor',1)
    //     ->where('is_active', 1)
    //     ->leftJoin('patient_schedules', function($query) use($date) {
    //         $query->on('patient_schedules.department_id', '=', 'departments.id')
    //         ->whereDate('schedule_datetime', $date);
    //     })
    //     ->select('departments.*')
    //     ->get()
    //     ->map(function($item) use($date) {
    //         $item->scheduled = $this->getDailyDepartmentSchedules($item->id, $date, true);
    //         $item->available = $item->daily_limit ? $item->daily_limit - $item->scheduled : null;
    //         return $item;
    //     })
    //     ->filter(function($item) {
    //         return $item->scheduled > 0;
    //     })
    //     ->values();
    // }

    protected function getDatesForDaysInMonth($monthYear, $daysArray) {
        list($year, $month) = explode('-', $monthYear);
        $startDate = Carbon::createFromDate($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        $currentDate = $startDate;

        $dayMap = [
            'sun' => Carbon::SUNDAY,
            'mon' => Carbon::MONDAY,
            'tue' => Carbon::TUESDAY,
            'wed' => Carbon::WEDNESDAY,
            'thu' => Carbon::THURSDAY,
            'fri' => Carbon::FRIDAY,
            'sat' => Carbon::SATURDAY
        ];

         $targetDays = array_map(function($day) use ($dayMap) {
            return $dayMap[strtolower($day)];
        }, $daysArray);
        
        $dates = [];
        while ($currentDate <= $endDate) {
            if (in_array($currentDate->dayOfWeek, $targetDays)) {
                $dates[] = $currentDate->format('Y-m-d');
            }
            $currentDate->addDay();
        }

        return $dates;
    }

    public function dailyDepartmentSchedule(Department $department, $month) {
        $departmentHasSchedule = $department->departmentHasSchedule->makeHidden(['id', 'department_id','created_at', 'updated_at', 'created_by']);
        $scheduleDays = $departmentHasSchedule->pluck('day_prefix');
        $dates = $this->getDatesForDaysInMonth($month, $scheduleDays);


        return $dates;

        // return $department->patientSchedule()
        // ->whereMonth('schedule_datetime', $month)
        // ->with('appointmentable')
        // ->get()
        // ->map(function($item) {

        //     return $item;
        // });
    }

    public function dailyPatientScheduleList(Request $request) {
        $pageSize = $request->pageSize || 5;
        $page = $request->page || 1;
        $date = $request->schedule_datetime ? date("Y-m-d", strtotime($request->schedule_datetime)) : now()->format("Y-m-d");
        return  PatientSchedule::whereDate('schedule_datetime', $date)->with(['appointmentable', 'department'])->paginate($pageSize);
    }

    public function getDepartmentsByMonth(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 50;
        $selectedYearMonth = $request->has('monthYear') ? $request->monthYear : now()->format("Y-m");
        $monthYear = explode('-',$selectedYearMonth);


        $paginator = Department::whereHas('patientSchedule', function($query) use($monthYear){
            $query->whereMonth('schedule_datetime', $monthYear[1])
            ->whereYear('schedule_datetime', $monthYear[0]);
        })
        ->paginate($pageSize);

        $items = $paginator->getCollection();

        $modifiedItems = $items->map(function($item) use($monthYear) {
            $item['scheduled'] = PatientSchedule::where('department_id', $item->id)
            ->whereMonth('schedule_datetime', $monthYear[1])
            ->whereYear('schedule_datetime', $monthYear[0])
            ->count();
            return $item;
        });

        return $paginator->setCollection($modifiedItems);
    }

    public function getScheduledByDepartment($departmentId, $date) {
        return PatientSchedule::whereDate('schedule_datetime', $date)
        ->count();
    }

    protected function getDailyLimit($deparmentId) {
        return Department::find($deparmentId)->daily_limit;
    }

    public function getScheduledDatesByDepartmentAndMonth(Request $request) {
        $selectedYearMonth = $request->has('monthYear') ? $request->monthYear : now()->format("Y-m");
        $monthYear = explode('-',$selectedYearMonth);
        
        $departmentId = $request->department_id;

        return PatientSchedule::whereYear('schedule_datetime', $monthYear[0])
        ->whereMonth('schedule_datetime', $monthYear[1])
        ->where('department_id', $departmentId)
        ->select(DB::raw('DATE(schedule_datetime) AS schedule_date'))
        ->distinct()
        ->orderBy('schedule_date', 'ASC')
        ->get()
        ->map(function($item) use($departmentId) {
            $item['scheduled'] = $this->getScheduledByDepartment($departmentId, $item->schedule_date);
            $item['daily_limit'] = $this->getDailyLimit($departmentId);
            return $item;
        });
    }

    public function getDepartmentPatientsByScheduleDate(Request $request) {
        $pageSize = $request->has('pageSize') ? $request->pageSize : 50;
        $departmentId = $request->department_id;
        $scheduleDate = $request->schedule_date;

        return PatientSchedule::whereDate('schedule_datetime', $scheduleDate)
        ->with('appointmentable')
        ->paginate($pageSize);
    }



    
}
