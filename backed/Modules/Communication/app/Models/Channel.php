<?php

namespace Modules\Communication\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Communication\Database\Factories\ChannelFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class Channel extends Model
{
    use HasFactory, HasUuids;

    // Fillable attributes
    protected $fillable = ['channel_name' , 'event' ,'status'];

    // Define the relationship with User model
    public function channelUsers()
    {
        return $this->hasMany(UserChannels::class)->with('channel');
    }

}
