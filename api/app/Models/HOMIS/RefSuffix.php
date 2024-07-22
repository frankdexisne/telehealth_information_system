<?php

namespace App\Models\HOMIS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefSuffix extends Model
{
    use HasFactory;
    protected $connection = 'homis';

    protected $table = 'ref_suffix';
}
