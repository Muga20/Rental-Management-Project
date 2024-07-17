<?php

namespace Modules\Payment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class HomePaymentTypes extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'account_name',
        'account_payBill',
        'account_number',
        'home_id',
        'unit_id',
        'status'
    ];

    public function home()
    {
        return $this->belongsTo(\Modules\Homes\Models\Home::class);
    }

    public function unit()
    {
        return $this->belongsTo(\Modules\Homes\Models\Units::class);
    }

    public function paymentChannel()
    {
        return $this->belongsTo(PaymentChannel::class, 'payment_channels_id');
    }
}
