<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    public function permission() {
        return $this->hasMany(\Spatie\Permission\Models\Permission::class);
    }
}
