<?php

namespace App\Models\HOMIS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HEnct extends Model
{
    use HasFactory;

    protected $connection = 'homis';

    protected $table = 'henctr';

    public $timestamps = false;

    protected $fillable = [
        'hpercode',
        'fhud',
        'enccode',
        'toecode',
        'sopcode1',
        'encstat',
        'enclock',
        'datemod',
        'updsw',
        'confdl',
        'entryby',
        'tacode',
        'chrono',
        'archv',
        'encdate',
        'enctime'
    ];

    protected static function boot() {
        parent::boot();

        static::creating(function($henct) {
            $currentMilliseconds = round(microtime(true) * 1000);
            $hfhudcode = env('HOMIS_HFHUDCODE','0001836');
            $henct->fhud = $hfhudcode;
            $henct->enccode = $hfhudcode . $henct->hpercode . now()->format("YmdHisu");
            $henct->toecode = 'OPD';
            $henct->sopcode1 = 'SELPA';
            $henct->encstat = 'I';
            $henct->enclock = 'Y';
            $henct->datemod = now()->format("Y-m-d H:i:s");
            $henct->updsw = 'N';
            $henct->confdl = 'N';
            $henct->entryby = auth()->user()->hpersonal_code;
            $henct->tacode = 'SERVI';
            $henct->chrono = now()->format("Y-m-d H:i:s");
            $henct->archv = 'N';
            $henct->encdate = now()->format("Y-m-d H:i:s");
            $henct->enctime = now()->format("Y-m-d H:i:s");
        });
    }
}
