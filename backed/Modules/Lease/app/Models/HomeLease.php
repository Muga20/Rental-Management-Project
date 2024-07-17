<?php

namespace Modules\Lease\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Homes\Models\Units;
use Modules\Lease\Database\factories\HomeLeaseFactory;
use Modules\User\Models\User;

class HomeLease extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'unit_id',
        'user_id',
        'start_date',
        'end_date',
        'rent_deposit',
        'additional_fees',
         //'contract_number'
    ];

    public function unit()
    {
        return $this->belongsTo(Units::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}




