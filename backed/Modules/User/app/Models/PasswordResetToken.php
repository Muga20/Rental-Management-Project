<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PasswordResetToken extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     */

    protected $fillable = [
        'email',
        'token',
    ];

}
