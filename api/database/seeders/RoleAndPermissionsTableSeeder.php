<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Enums\{Permission, Role};
use Spatie\Permission\Models\{Permission as ModelPermission, Role as ModelRole};
use App\Models\Module;

class RoleAndPermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $modules = [
            'Users' => [
                [
                    'id' => 1,
                    'name' => Permission::USER_LIST,
                    'display_name' => 'LIST'
                ],
                [
                    'id' => 2,
                    'name' => Permission::USER_CREATE,
                    'display_name' => 'CREATE'
                ],
                [
                    'id' => 3,
                    'name' => Permission::USER_UPDATE,
                    'display_name' => 'UPDATE'
                ],
                [
                    'id' => 4,
                    'name' => Permission::USER_DELETE,
                    'display_name' => 'DELETE'
                ],
            ],
            'Roles' => [
                [
                    'id' => 5,
                    'name' => Permission::ROLE_LIST,
                    'display_name' => 'LIST'
                ],
                [
                    'id' => 6,
                    'name' => Permission::ROLE_CREATE,
                    'display_name' => 'CREATE'
                ],
                [
                    'id' => 7,
                    'name' => Permission::ROLE_UPDATE,
                    'display_name' => 'UPDATE'
                ],
                [
                    'id' => 8,
                    'name' => Permission::ROLE_DELETE,
                    'display_name' => 'DELETE'
                ],
            ],
            'Departments' => [
                [
                    'id' => 9,
                    'name' => Permission::DEPARTMENT_LIST,
                    'display_name' => 'LIST'
                ],
                [
                    'id' => 10,
                    'name' => Permission::DEPARTMENT_CREATE,
                    'display_name' => 'CREATE'
                ],
                [
                    'id' => 11,
                    'name' => Permission::DEPARTMENT_UPDATE,
                    'display_name' => 'UPDATE'
                ],
                [
                    'id' => 12,
                    'name' => Permission::DEPARTMENT_DELETE,
                    'display_name' => 'DELETE'
                ],
            ],
            'Patients' => [
                [
                    'id' => 13,
                    'name' => Permission::PATIENT_LIST,
                    'display_name' => 'LIST'
                ],
                [
                    'id' => 14,
                    'name' => Permission::PATIENT_CREATE,
                    'display_name' => 'CREATE'
                ],
                [
                    'id' => 15,
                    'name' => Permission::PATIENT_UPDATE,
                    'display_name' => 'UPDATE'
                ],
                [
                    'id' => 16,
                    'name' => Permission::PATIENT_DELETE,
                    'display_name' => 'DELETE'
                ],
                [
                    'id' => 17,
                    'name' => Permission::PATIENT_SCHEDULE_LIST,
                    'display_name' => 'SCHEDULE LIST'
                ],
                [
                    'id'=> 18,
                    'name' => Permission::PATIENT_SCHEDULE_DELETE,
                    'display_name' => 'SCHEDULE DELETE',
                ],
                [
                    'id'=> 19,
                    'name' => Permission::PATIENT_BIND,
                    'display_name' => 'BIND',
                ],
                [
                    'id' => 20,
                    'name' => Permission::CHIEF_COMPLAINT_LIST,
                    'display_name' => 'CHIEF COMPLAINT LIST'
                ],
                [
                    'id' => 21,
                    'name' => Permission::CHIEF_COMPLAINT_CREATE,
                    'display_name' => 'CHIEF COMPLAINT CREATE'
                ],
                [
                    'id' => 22,
                    'name' => Permission::CHIEF_COMPLAINT_CREATE_FOLLOW_UP,
                    'display_name' => 'CHIEF COMPLAINT CREATE FOLLOW UP'
                ],
                [
                    'id' => 23,
                    'name' => Permission::CHIEF_COMPLAINT_UPDATE,
                    'display_name' => 'CHIEF COMPLAINT UPDATE'
                ],
                [
                    'id' => 24,
                    'name' => Permission::CHIEF_COMPLAINT_DELETE,
                    'display_name' => 'CHIEF COMPLAINT DELETE'
                ],
            ],

            'Teleclerk-Logs' => [
                [
                    'id' => 25,
                    'name' => Permission::TELECLERK_LOG_LIST,
                    'display_name' => 'LIST'
                ],
                [
                    'id' => 26,
                    'name' => Permission::TELECLERK_LOG_CREATE,
                    'display_name' => 'CREATE'
                ],
                [
                    'id' => 27,
                    'name' => Permission::TELECLERK_LOG_UPDATE,
                    'display_name' => 'UPDATE'
                ],
                [
                    'id' => 28,
                    'name' => Permission::TELECLERK_LOG_DELETE,
                    'display_name' => 'DELETE'
                ],
            ],
            
            'Consultations' => [
                [
                    'id' => 30,
                    'name' => Permission::ENCOUNTER_TRIAGE_TO_DEPARTMENT,
                    'display_name' => 'TRIAGE TO DEPARTMENT'
                ],
                [
                    'id' => 31,
                    'name' => Permission::NEW_CONSULTATIONS,
                    'display_name' => 'NEW'
                ],
                [
                    'id' => 32,
                    'name' => Permission::FOLLOW_UP_CONSULTATIONS,
                    'display_name' => 'FOLLOW UPS'
                ],
                [
                    'id' => 33,
                    'name' => Permission::FOR_ATTACHMENT_CONSULTATIONS,
                    'display_name' => 'FOR ATTACHMENTS'
                ],
                [
                    'id' => 34,
                    'name' => Permission::FOR_PRESCRIPTION_CONSULTATIONS,
                    'display_name' => 'FOR PRESCRIPTIONS'
                ],
                [
                    'id' => 35,
                    'name' => Permission::ADDITIONAL_ADVICE_CONSULTATIONS,
                    'display_name' => 'ADDITIONAL ADVICE'
                ],
                [
                    'id' => 36,
                    'name' => Permission::UNTRIAGE_CONSULTATIONS,
                    'display_name' => 'UNTRIAGE'
                ],
                [
                    'id' => 37,
                    'name' => Permission::TRIAGED_CONSULTATIONS,
                    'display_name' => 'TRIAGED'
                ],
                [
                    'id' => 38,
                    'name' => Permission::ASSIGNED_CONSULTATIONS,
                    'display_name' => 'ASSIGNED'
                ],
                [
                    'id' => 39,
                    'name' => Permission::OUT_WHEN_CALLED_CONSULTATIONS,
                    'display_name' => 'OUT WHEN CALLED'
                ],
                [
                    'id' => 40,
                    'name' => Permission::ACTIVE_CONSULTATIONS,
                    'display_name' => 'ACTIVE'
                ],
                [
                    'id' => 41,
                    'name' => Permission::COMPLETED_CONSULTATIONS,
                    'display_name' => 'COMPLETED'
                ],
                [
                    'id' => 42,
                    'name' => Permission::HOMIS_BINDING_CONSULTATIONS,
                    'display_name' => 'TRIAGE TO DEPARTMENT'
                ]
            ],

            'Doctors' => [
                [
                    'id' => 29,
                    'name' => Permission::ENCOUNTER_ASSIGN,
                    'display_name' => "ASSIGN TO DOCTOR"
                ],
                [
                    'id' => 43,
                    'name' => Permission::DOCTOR_UNFINISH_CONSULTATIONS,
                    'display_name' => 'COMPLETED'
                ],
                [
                    'id' => 44,
                    'name' => Permission::DOCTOR_NEW_CONSULTATIONS,
                    'display_name' => 'NEW'
                ],
                [
                    'id' => 45,
                    'name' => Permission::DOCTOR_FOLLOW_UP_CONSULTATIONS,
                    'display_name' => 'FOLLOW UP'
                ],
                [
                    'id' => 46,
                    'name' => Permission::DOCTOR_ACTIVE_CONSULTATIONS,
                    'display_name' => 'ACTIVE'
                ],
                [
                    'id' => 47,
                    'name' => Permission::DOCTOR_COMPLETED_CONSULTATIONS,
                    'display_name' => 'COMPLETED'
                ],
                [
                    'id' => 48,
                    'name' => Permission::DOCTOR_OUT_WHEN_CALLED_CONSULTATIONS,
                    'display_name' => 'OUT WHEN CALLED'
                ],
            ]
        ];

        $roles = [
            [
                'id' => 1,
                'role' => Role::TELECLERK,
                'permissions' => [
                    Permission::PATIENT_LIST,
                    Permission::PATIENT_CREATE,
                    Permission::PATIENT_UPDATE,
                    Permission::PATIENT_DELETE,
                    Permission::PATIENT_BIND,
                    Permission::CHIEF_COMPLAINT_LIST,
                    Permission::CHIEF_COMPLAINT_CREATE,
                    Permission::CHIEF_COMPLAINT_CREATE_FOLLOW_UP,
                    Permission::CHIEF_COMPLAINT_UPDATE,
                    Permission::CHIEF_COMPLAINT_DELETE,
                    Permission::PATIENT_SCHEDULE_LIST,
                    Permission::PATIENT_SCHEDULE_DELETE,
                    Permission::NEW_CONSULTATIONS,
                    Permission::FOLLOW_UP_CONSULTATIONS,
                    Permission::FOR_ATTACHMENT_CONSULTATIONS,
                    Permission::FOR_PRESCRIPTION_CONSULTATIONS,
                    Permission::ADDITIONAL_ADVICE_CONSULTATIONS,
                    Permission::UNTRIAGE_CONSULTATIONS,
                    Permission::TRIAGED_CONSULTATIONS,
                    Permission::ASSIGNED_CONSULTATIONS,
                    Permission::OUT_WHEN_CALLED_CONSULTATIONS,
                    Permission::ACTIVE_CONSULTATIONS,
                    Permission::COMPLETED_CONSULTATIONS,
                    Permission::HOMIS_BINDING_CONSULTATIONS,
                    Permission::TELECLERK_LOG_LIST,
                    Permission::TELECLERK_LOG_CREATE,
                    Permission::TELECLERK_LOG_UPDATE,
                    Permission::TELECLERK_LOG_DELETE,
                ]
            ],
            [
                'id' => 2,
                'role' => Role::ADMINISTRATOR,
                'permissions' => []
            ],
            [
                'id' => 3,
                'role' => Role::TELEANCHOR,
                'permissions' => [
                    Permission::UNTRIAGE_CONSULTATIONS,
                    Permission::TRIAGED_CONSULTATIONS,
                    Permission::ASSIGNED_CONSULTATIONS,
                    Permission::ACTIVE_CONSULTATIONS,
                    Permission::COMPLETED_CONSULTATIONS,
                    Permission::ENCOUNTER_TRIAGE_TO_DEPARTMENT,
                ]
            ],
            [
                'id' => 4,
                'role' => Role::DOCTOR,
                'permissions' => [
                    Permission::DOCTOR_UNFINISH_CONSULTATIONS,
                    Permission::DOCTOR_NEW_CONSULTATIONS,
                    Permission::DOCTOR_FOLLOW_UP_CONSULTATIONS,
                    Permission::DOCTOR_ACTIVE_CONSULTATIONS,
                    Permission::DOCTOR_COMPLETED_CONSULTATIONS,
                    Permission::DOCTOR_OUT_WHEN_CALLED_CONSULTATIONS,
                    Permission::ENCOUNTER_ASSIGN,
                ]
            ],
            [
                'id' => 5,
                'role' => Role::TECHSUPPORT,
                'permissions' => []
            ],
            [
                'id' => 7,
                'role' => Role::TRIAGE,
                'permissions'=> []
            ]
            
        ];

        foreach($modules as $module => $permissions) {
            $rowModule = Module::firstOrNew(['name' => $module]);

            if (!$rowModule->exists) {
                $rowModule->save();
            }

            foreach ($permissions as $permission) {
                $permissionRow = ModelPermission::firstOrNew([
                    'name' => $permission['name']
                ]);

                if (!$permissionRow->exists) {
                    $permissionRow->fill([
                        'id' => $permission['id'],
                        'module_id' => $rowModule->id,
                        'display_name' => $permission['display_name'],
                        'guard_name' => 'web'
                    ])
                    ->save();
                }
            }
        }


        foreach($roles as $index => $role) {
            $roleRow = ModelRole::firstOrNew([
                'name' => $role['role']
            ]);

            if (!$roleRow->exists) {
                ModelRole::create([
                    'id' => $role['id'],
                    'name' => $role['role'],
                    'display_name' => strtoupper($role['role']),
                    'guard_name' => 'web'
                ])
                ->syncPermissions($role['permissions']);
            }
        }
        
    }
}
