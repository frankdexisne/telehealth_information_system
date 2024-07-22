<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\ActivityLogTrait;
use App\Contracts\CallInterface;

class TeleMedicineDoctor extends Model
{
    use HasFactory, ActivityLogTrait;
}
