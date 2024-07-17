<?php

namespace Modules\Payment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Payment\Database\Factories\PlansFactory;
use Modules\Company\Models\Company;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Plans extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'plan_name',
        'duration',
        'price',
        'number_of_companies',
        'number_of_agents',
    ];

    public function companies()
    {
        return $this->hasMany(Company::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
