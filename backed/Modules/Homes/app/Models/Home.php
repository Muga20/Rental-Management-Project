<?php

namespace Modules\Homes\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Company\Models\Company;
use Modules\User\Models\User;
use Modules\Payment\Models\HomePaymentTypes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Home extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name', 'location', 'images',
        'houseCategory', 'stories',
        'status', 'description','rentPaymentDay',
        'company_id', 'phone',
        'email', 'slug','user_id','landlord_id'
    ];

    protected $table = 'homes';

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function units()
    {
        return $this->hasMany(Units::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function homePaymentTypes()
    {
        return $this->hasMany(HomePaymentTypes::class);
    }

    public function landlord()
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function agents()
    {
        return $this->belongsToMany(User::class, 'home_agents', 'home_id', 'agent_id');
    }

    public function caretakers()
    {
        return $this->belongsToMany(User::class, 'home_care_takers','home_id', 'care_taker_id', );

    }



}
