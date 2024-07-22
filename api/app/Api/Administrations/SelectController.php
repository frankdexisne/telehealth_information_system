<?php

namespace App\Api\Administrations;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Department, Designation, PatientCondition, Disposition, ConsultationStatus, User, Platform};
use App\Models\HOMIS\{RefCstatus, HRegion, HProv, HCity, HBrgy, RefSuffix, Hpersonal};
use Spatie\Permission\Models\Role;

class SelectController extends Controller
{
    protected function dataSources(string $source) {
        $sources = [
            'platforms' => [
                'model' => Platform::query(),
                'field' => [
                    'value' => 'id',
                    'label' => 'name'
                ],
            ],
            'departments' => [
                'model' => Department::query(),
                'field' => [
                    'value' => 'id',
                    'label' => 'name'
                ],
            ],
            'designations' => [
                'model' => Designation::query(),
                'field' => [
                    'value' => 'id',
                    'label' => 'name'
                ],
            ],
            'dispositions' => [
                'model' => Disposition::query(),
                'field' => [
                    'value' => 'id',
                    'label' => 'name'
                ],
            ],
            'roles' => [
                'model' => Role::query(),
                'field' => [
                    'value' => 'id',
                    'label' => 'name'
                ],
            ],
            'patient-conditions' => [
                'model' => PatientCondition::query(),
                'field' => [
                    'value' => 'id',
                    'label' => 'name'
                ],
            ],
            'consultation-statuses' => [
                'model' => ConsultationStatus::query(),
                'field' => [
                    'value' => 'id',
                    'label' => 'name'
                ],
            ],
            'hpersonals' => [
                'model' => Hpersonal::query()->where('empstat', 'A'),
                'field' => [
                    'value' => 'employeeid',
                    'label' => 'employee_name'
                ],
            ],
            'civil-statuses' => [
                'model' => RefCstatus::query(),
                'field' => [
                    'value' => 'dcode',
                    'label' => 'describe'
                ],
            ],
            'suffixes' => [
                'model' => RefSuffix::query(),
                'field' => [
                    'value' => 'dcode',
                    'label' => 'describe'
                ],
            ],
            'regions' => [
                'model' => HRegion::query()->whereNotNull('describe'),
                'field' => [
                    'value' => 'regcode',
                    'label' => 'describe'
                ],
            ],
            'provinces' => [
                'model' => HProv::query(),
                'field' => [
                    'value' => 'provcode',
                    'label' => 'provname'
                ],
            ],
            'cities' => [
                'model' => HCity::query(),
                'field' => [
                    'value' => 'ctycode',
                    'label' => 'ctyname'
                ],
            ],
            'barangays' => [
                'model' => HBrgy::query(),
                'field' => [
                    'value' => 'brgycode',
                    'label' => 'brgyname'
                ],
            ],
            'teleclerks' => [
                'model' => User::query()->role(Role::where('name', 'teleclerk')->first())->orderBy('name', 'ASC'),
                'field' => [
                    'value' => 'id',
                    'label' => 'name'
                ],
            ],
            'doctors' => [
                'model' => User::query()->role(Role::where('name', 'doctor')->first())->orderBy('name', 'ASC'),
                'field' => [
                    'value' => 'id',
                    'label' => 'name'
                ],
            ]
        ];

        return $sources[$source];
    }

    public function makeSelect(Request $request, string $source) {

        if (!$selectedSource = $this->dataSources($source)) {
            return $this->error("Resource not found", Response::HTTP_NOT_FOUND, ApiErrorCode::RESOURCE_NOT_FOUND);
        }

        if ($source == 'departments') return $this->getDepartments($request);

        if ($source == 'provinces') return $this->getProvinces($request);

        if ($source == 'cities')  return $this->getCities($request);

        if ($source == 'barangays') return $this->getBarangays($request);
        

        $fields = $selectedSource['field'];

        return $selectedSource['model']
            ->get()
            ->map(function ($item) use ($fields) {
                $item['label'] = $item[$fields['label']];
                $collect = collect($item)->only(['label'])->all();
                $collect['value'] = $item[$fields['value']];
                return $collect;
            });
    }

    protected function getDepartments(Request $request) {
        $isDoctor = $request->has('is_doctor') ? $request->is_doctor : null;
        $exclude = $request->has('exclude') ? $request->exclude : null;
        return Department::when($isDoctor, function($query) use($isDoctor) {
                $query->where('is_doctor', $isDoctor);
            })
            ->when($exclude, function($query) use($exclude) {
                $query->where('id', '<>', $exclude);
            })
            ->get()
            ->map(function ($item) {
                $item['label'] = $item['name'];
                $collect = collect($item)->only(['label'])->all();
                $collect['value'] = $item['id'];
                return $collect;
            });
    }

    protected function getProvinces(Request $request) {
        if ($request->has('regcode')) {
            return HProv::where('provreg', $request->regcode)
            ->get()
            ->map(function ($item) {
                $item['label'] = $item['provname'];
                $collect = collect($item)->only(['label'])->all();
                $collect['value'] = $item['provcode'];
                return $collect;
            });
        }

        return [];
    }

    protected function getCities(Request $request) {
        if ($request->has('provcode')) {
            return HCity::where('ctyprovcod', $request->provcode)
            ->get()
            ->map(function ($item)  {
                $item['label'] = $item['ctyname'];
                $collect = collect($item)->only(['label'])->all();
                $collect['value'] = $item['ctycode'];
                return $collect;
            });
        }

        return [];
    }

    protected function getBarangays(Request $request) {
        if ($request->has('ctycode')) {
            return HBrgy::where('bgymuncod', $request->ctycode)
            ->get()
            ->map(function ($item) {
                $item['label'] = $item['bgyname'];
                $collect = collect($item)->only(['label'])->all();
                $collect['value'] = $item['bgycode'];
                return $collect;
            });
        }

        return [];
    }

    public function getLibraries(Request $request) {
        return [
            'departments' => $this->makeSelect($request, 'departments'),
            'designations' => $this->makeSelect($request, 'designations'),
            'dispositions' => $this->makeSelect($request, 'dispositions'),
            'roles' => $this->makeSelect($request, 'roles'),
            'patient_conditions' => $this->makeSelect($request, 'patient-conditions'),
            'consultation_statuses' => $this->makeSelect($request, 'consultation-statuses'),
            'platforms' => $this->makeSelect($request, 'platforms'),
            'teleclerks' => $this->makeSelect($request, 'teleclerks'),
            'doctors' => $this->makeSelect($request, 'doctors')
        ];
    }

    public function getHomisLibraries(Request $request) {
        return [
            'civil_statuses' => $this->makeSelect($request, 'civil-statuses'),
            'suffixes' => $this->makeSelect($request, 'suffixes'),
            'regions' => $this->makeSelect($request, 'regions')
        ];
    }
}
