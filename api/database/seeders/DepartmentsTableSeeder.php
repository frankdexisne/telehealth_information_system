<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{Department, DepartmentHasSchedule};
use Illuminate\Support\Facades\DB;

class DepartmentsTableSeeder extends Seeder
{
    protected $oldDB;

    public function __construct(){
        $this->oldDB = DB::connection('old_telehealth');
    }
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = json_decode($this->oldDB->table('departments')
        ->select('id', 'name', 'is_doctor', 'is_active', 'created_at', 'updated_at')
        ->get(), true);

        Department::upsert($departments, ['id', 'name'], ['id', 'name', 'is_doctor', 'is_active', 'created_at', 'updated_at']);
        

        $newDepartments = [
            [
                'id' => 18,
                'name' => 'General Surgery',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 19,
                'name' => 'Orthopedic',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ],  [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ]
                ]
            ], [
                'id' => 20,
                'name' => 'Urology',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '14:00:00',
                        'end_at' => '16:00:00'
                    ], 
                ]
            ], [
                'id' => 21,
                'name' => 'Neuro',
                'schedule' => [
                    [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ],
                ]
            ], [
                'id' => 22,
                'name' => 'ENT (Ears, Nose, Throat)',
                'schedule' => [
                     [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ]
                ]
            ], [
                'id' => 23,
                'name' => 'OR Scheduling',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], 
                ]
            ], [
                'id' => 24,
                'name' => 'General Pedia Consultation',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 25,
                'name' => 'PIMAM - OTC',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 26,
                'name' => 'Pedia - Gastro',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 27,
                'name' => 'Pedia - PULMO',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 28,
                'name' => 'Pedia - NEURO',
                'schedule' => [
                    [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 29,
                'name' => 'Pedia - Cardio',
                'schedule' => [
                    [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 30,
                'name' => 'Pedia - Nephro',
                'schedule' => [
                    [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 31,
                'name' => 'Neonatal High Risk Clinic (NHRC)',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ]
                ]
            ], [
                'id' => 32,
                'name' => 'Well Baby',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ]
                ]
            ], [
                'id' => 33,
                'name' => 'KMC (Kangaroo Mother Care)',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ]
                ]
            ], [
                'id' => 34,
                'name' => 'Newborn screening result releasing',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 35,
                'name' => 'Newborn screening continuity clinic',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ],
                ]
            ], [
                'id' => 36,
                'name' => 'G6PDD Confirmatory Test',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ],
                ]
            ], [
                'id' => 37,
                'name' => 'Lactation Management',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 38,
                'name' => 'Wellness General Consultation',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 39,
                'name' => 'Animal Bite Treatment Center (ABTC)',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 40,
                'name' => 'Derma (Personnel and Non-Personnel)',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ], 
                ]
            ], [
                'id' => 41,
                'name' => 'General Internal Medicine',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 42,
                'name' => 'CP Clearance',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '13:00:00',
                        'end_at' => '15:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '13:00:00',
                        'end_at' => '15:00:00'
                    ]
                ]
            ], [
                'id' => 43,
                'name' => 'Internal Medicine - Rheuma',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], 
                ]
            ], [
                'id' => 44,
                'name' => 'Internal Medicine - Endo',
                'schedule' => [
                    [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ]
                ]
            ], [
                'id' => 45,
                'name' => 'Diabetic Clinic',
                'schedule' => [
                    [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '12:00:00'
                    ]
                ]
            ], [
                'id' => 46,
                'name' => 'Internal Medicine - Nephro',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 47,
                'name' => 'Internal Medicine - Neuro',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], 
                ]
            ], [
                'id' => 48,
                'name' => 'Internal Medicine - Pulmo',
                'schedule' => [
                    [
                        'day_id' => 5,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 49,
                'name' => 'Internal Medicine - HEMA',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 50,
                'name' => 'Internal Medicine - GASTRO',
                'schedule' => [
                   [
                        'day_id' => 5,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 51,
                'name' => 'Cardio Clinic and Heart Center',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 52,
                'name' => 'Ortho CP Clearance',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 53,
                'name' => 'Other Cases CP Clearance',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 54,
                'name' => 'Postnatal',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], 
                ]
            ], [
                'id' => 55,
                'name' => 'General Gynecology Clinic',
                'schedule' => [
                    [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ],[
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 56,
                'name' => 'Reproductive Endocinology and Infertility Clinic',
                'schedule' => [
                    [
                        'day_id' => 2,
                        'start_at' => '09:00:00',
                        'end_at' => '11:00:00'
                    ]
                ]
            ], [
                'id' => 57,
                'name' => 'Menopause Clinic',
                'schedule' => [
                    [
                        'day_id' => 2,
                        'start_at' => '09:00:00',
                        'end_at' => '11:00:00'
                    ]
                ]
            ], [
                'id' => 58,
                'name' => 'OB Normal Prenatal Clinic',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 59,
                'name' => 'Teen Parents Clinic',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '03:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 60,
                'name' => 'Family Planning',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 61,
                'name' => 'High Risk Pregnancy Clinic',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '09:00:00',
                        'end_at' => '12:00:00'
                    ]
                ]
            ], [
                'id' => 62,
                'name' => 'Colposcopy clinic (BCC Building)',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '09:00:00',
                        'end_at' => '12:00:00'
                    ],
                ]
            ], [
                'id' => 63,
                'name' => 'Trophoblastic Disease clinic',
                'schedule' => [
                    [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '11:00:00'
                    ],
                ]
            ], [
                'id' => 64,
                'name' => 'Gynecology oncology clinic',
                'schedule' => [
                    [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 65,
                'name' => 'Consultation HIV Screening',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 66,
                'name' => 'STI Clinic',
                'schedule' => [
                    [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ],
                ]
            ], [
                'id' => 67,
                'name' => 'OPD Checkup  and Referral',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 68,
                'name' => 'Follow up of Enrolled Patients and Refill of Medicine',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ],[
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ],[
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 69,
                'name' => 'Internal and External Referral',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 70,
                'name' => 'Pedia ONCO',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 71,
                'name' => 'Breast BUKOL',
                'schedule' => [
                    [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ],[
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 72,
                'name' => 'Internal Medicine ONCO',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ],
                ]
            ],  [
                'id' => 73,
                'name' => 'HEMA',
                'schedule' => [
                    [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ],
                ]
            ], [
                'id' => 74,
                'name' => 'Surgery ONCO',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '12:00:00',
                        'end_at' => '16:00:00'
                    ], 
                ]
            ], [
                'id' => 75,
                'name' => 'BCC - URO',
                'schedule' => [
                     [
                        'day_id' => 3,
                        'start_at' => '12:00:00',
                        'end_at' => '16:00:00'
                    ],
                ]
            ], [
                'id' => 76,
                'name' => 'Pain Management',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ],
                ]
            ], [
                'id' => 77,
                'name' => 'Gyne ONCO',
                'schedule' => [
                    [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ],[
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 78,
                'name' => 'Rehab Consultation',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '11:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '11:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '13:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ], [
                'id' => 79,
                'name' => 'Rehab Therapy',
                'schedule' => [
                    [
                        'day_id' => 1,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 2,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 3,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 4,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ], [
                        'day_id' => 5,
                        'start_at' => '08:00:00',
                        'end_at' => '16:00:00'
                    ]
                ]
            ],
        ];

        foreach ($newDepartments as $department) {
            $newDepartmentRow = Department::firstOrNew(['id' => $department['id'], 'name' => $department['name']]);
            if (!$newDepartmentRow->exists) {
                $newDepartmentRow->fill(['is_doctor' => 1])->save();
                $departmentHasSchedules = $department['schedule'];

                foreach($departmentHasSchedules as $departmentHasSchedule) {
                    DepartmentHasSchedule::create([
                        'department_id' => $newDepartmentRow->id,
                        'day_id' => $departmentHasSchedule['day_id'],
                        'start_at' => $departmentHasSchedule['start_at'],
                        'end_at' => $departmentHasSchedule['end_at']
                    ]);
                }
            }

        }
    }
}
