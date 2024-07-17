<?php

namespace Modules\Payment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Payment\Database\Factories\StkrequestFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Stkrequest extends Model
{
    use HasFactory, HasUuids;
//
//    protected $fillable = [
//    ];

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }
}
