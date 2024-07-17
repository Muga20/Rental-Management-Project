<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Database\Factories\NewUserSessionFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class NewUserSession extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['email', 'token', 'otp_code'];

    protected static function newFactory(): NewUserSessionFactory
    {
        //return NewUserSessionFactory::new();
    }
}
