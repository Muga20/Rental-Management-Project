<?php

namespace Modules\User\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Modules\Company\Models\Company;
use Modules\Communication\Models\UserChannels;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class User extends Authenticatable implements JWTSubject
{
    use Notifiable , HasUuids;

    protected $fillable = [
        'email', 'password', 'status', 'company_id',
        'role_id', 'otp', 'authType', 'uuid', 'provider',
        'provider_id', 'provider_token', 'two_factor_code',
        'two_factor_expires_at', 'phone_no', 'two_fa_status',
    ];

    protected $hidden = [
        'password',
        'otp',
        'provider_token',
        'two_factor_code',
        'two_factor_expires_at',
        'sms_number',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Roles::class, 'user_roles', 'user_id', 'role_id');
    }

    public function hasAnyRole($roles)
    {
        $roles = is_array($roles) ? $roles : [$roles];

        return $this->roles()->whereIn('name', $roles)->exists();
    }

    public function detail()
    {
        return $this->hasOne(UserDetails::class);
    }

    public function channel()
    {
        return $this->hasMany(UserChannels::class)->with('channel');
    }

}
