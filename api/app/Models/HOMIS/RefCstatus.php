<?php

namespace App\Models\HOMIS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefCstatus extends Model
{
    use HasFactory;

    protected $connection = 'homis';

    protected $table = 'ref_cstatus';

}
