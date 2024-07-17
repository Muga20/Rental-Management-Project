<?php

namespace Modules\Lease\app\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Homes\Models\Units;
use Modules\Lease\Database\factories\LeaseFactory;
use Modules\User\Models\User;

class Lease extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'unit_id',
        'user_id',
        'start_date',
        'end_date',
        'rent_deposit',
        'additional_fees'
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
