<?php

namespace Modules\Payment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Payment\Database\Factories\SubscriptionFactory;
use Modules\Company\Models\Company;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Subscription extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'stkPush_id', 'plan_id', 'company_id',
    ];

    public function stkrequest()
    {
        return $this->belongsTo(Stkrequest::class, 'stkPush_id');
    }

    public function plan()
    {
        return $this->belongsTo(Plans::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
