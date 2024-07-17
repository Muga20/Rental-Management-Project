<?php

namespace Modules\Payment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Payment\Database\Factories\PaymentTypeFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class PaymentType extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name', 'status'
    ];

    // public function payments()
    // {
    //     return $this->hasMany(unitRecords::class, 'payment_type_id');
    // }

    // public function homes()
    // {
    //     return $this->belongsToMany(Home::class, 'home_payment_types', 'payment_type_id', 'home_id');
    // }


}
