<?php

namespace Modules\Payment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PaymentChannel extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'channel_name',
        'slug',
        'status',
        'channel_logo',
        'payment_type_id',
    ];

    public function paymentType()
    {
        return $this->belongsTo(PaymentType::class, 'payment_type_id');
    }
}
