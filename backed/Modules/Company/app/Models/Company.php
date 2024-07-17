<?php

namespace Modules\Company\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\Payment\Models\Subscription;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class Company extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name', 'email', 'status', 'address',
        'phone', 'description', 'theme',
        'logoImage', 'slug', 'location',
        'companyUrl', 'companyId',
    ];

    // public function plan()
    // {
    //     return $this->belongsTo(Plans::class);
    // }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    // public function events()
    // {
    //     return $this->hasMany(Event::class);
    // }

    // public function Home()
    // {
    //     return $this->hasMany(Home::class);
    // }

    // public function channelUsers()
    // {
    //     return $this->hasMany(ChannelUsers::class);
    // }
}
