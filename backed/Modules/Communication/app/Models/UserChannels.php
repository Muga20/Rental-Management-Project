<?php

namespace Modules\Communication\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Modules\User\Models\User;


class UserChannels extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'user_channels';

    // Define fillable fields for mass assignment
    protected $fillable = [
        'user_id',
        'company_id',
        'channel_id',
    ];

    /**
     * Define the relationship with the User model.
     * Assuming each channel user belongs to a specific user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Define the relationship with the Company model.
     * Assuming each channel user belongs to a specific company.
     */
    public function company()
    {
        return $this->belongsTo(\Modules\Company\Models\Company::class);
    }

    /**
     * Define the relationship with the Channel model.
     * Assuming each channel user belongs to a specific channel.
     */
    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
