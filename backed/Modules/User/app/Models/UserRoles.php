<?php

namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\User\Database\Factories\UserRolesFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class UserRoles extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'user_roles';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'role_id',
    ];

    /**
     * Get the user associated with the role.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the role associated with the user.
     */
    public function role()
    {
        return $this->belongsTo(Roles::class);
    }

}
