<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentHasSchedule extends Model
{
    use HasFactory;

    protected $table = 'department_has_schedule';

    protected $appends = ['day_prefix'];

    public function getDayPrefixAttribute() {
        return Day::find($this->attributes['day_id'])->prefix;
    }
}
