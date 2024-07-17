<?php

namespace Modules\Homes\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;

class HomeCareTakers extends Model
{
    use HasFactory, HasUuids;

    public function careTakers()
    {
        return $this->belongsToMany(User::class, 'home_care_taker', 'home_id', 'care_taker_id');

    }
}
