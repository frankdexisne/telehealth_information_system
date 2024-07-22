<?php

namespace App\Models\HOMIS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class UserAcc extends Authenticatable
{
    use HasFactory;

    protected $connection = 'homis';

    protected $table = 'user_acc';

     protected $primaryKey = 'user_name'; //ADD

    protected $keyType = 'string'; //ADD

    public $incrementing = false; //ADD

    public $timestamps = false;

    protected $encryptable = ['user_md5'];

    public function setUserMd5Attribute($value)
    {
        $this->attributes['user_md5'] = md5($value);
    }

    public function getAuthPassword()
    {
        return $this->user_md5;
    }
}
