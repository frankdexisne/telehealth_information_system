<?php

namespace App\Models\HOMIS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hpersonal extends Model
{
    use HasFactory;

    protected $connection = 'homis';

    protected $table = 'hpersonal';

    protected $appends = ['employee_name'];

    public function getEmployeeNameAttribute() {
        return $this->lastname . ', ' . $this->firstname . ' ' . $this->middlename;
    }
}
