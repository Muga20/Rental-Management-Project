<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\User\Database\Factories\UserChanelsFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class UserChannels extends Model
{
    use HasFactory , HasUuids;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    protected static function newFactory(): UserChanelsFactory
    {
        //return UserChanelsFactory::new();
    }
}
