<?php

namespace App\Api\Patients;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Models\HOMIS\Hperson;

class HpersonController extends ApiController
{
    public function __construct(Hperson $hperson) {
        $this->modelQuery = $hperson->query();
        $this->model = $hperson;
    }

    protected function searchHandler($query, Request $request) {
        $lname = $request->has('lname') ? $request->lname : null;
        $fname = $request->has('fname') ? $request->fname : null;
        $mname = $request->has('mname') ? $request->mname : null;

        return $query
        ->when($lname, function($query) use($lname) {
            $query->where('patlast', 'LIKE', substr($lname,0,3) . '%');
        })
        ->when($fname, function($query) use($fname) {
            $query->where('patfirst', 'LIKE', substr($fname,0,3) . '%');
        })
        ->when($mname, function($query) use($mname) {
            $query->where('patmiddle', 'LIKE', substr($mname,0,3) . '%');
        });
    }
}
