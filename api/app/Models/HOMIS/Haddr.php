<?php

namespace App\Models\HOMIS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Haddr extends Model
{
    use HasFactory;

    protected $connection = 'homis';

    protected $table = 'haddr';

    public $timestamps = false;

    protected $fillable = [
        'addlock',
        'updsw',
        'confdl',
        'entryby',
        'sysrem',
        'hpercode',
        'patstr',
        'brg',
        'ctycode',
        'provcode',
        'patzip',
        'haddrdte'
    ];

    protected static function boot(){
        parent::boot();

        static::creating(function($haddr) {
            $currentMilliseconds = round(microtime(true) * 1000);
            $haddr->addlock = 'N';
            $haddr->updsw = 'N';
            $haddr->confdl = 'N';
            $haddr->haddrdte = now()->format("Y-m-d H:i:s");
            // $haddr->entryby = auth()->user()->hpersonal_code;
            $haddr->entryby = null;
            $haddr->sysrem = 'TH';
        });
    }
}
