<?php

namespace Modules\Communication\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Communication\Database\Factories\NotificationFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class Notification extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type', 'message' ,'channel_id'
    ];
}
