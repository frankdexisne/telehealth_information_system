<?php

namespace App\Models\HOMIS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TeleclerkLog;

class HCity extends Model
{
    use HasFactory;

    protected $connection = 'homis';

    protected $table = 'hcity';

    public function teleclerkLog() {
        return $this->hasMany(TeleclerkLog::class, 'ctycode', 'ctycode');
    }
}
