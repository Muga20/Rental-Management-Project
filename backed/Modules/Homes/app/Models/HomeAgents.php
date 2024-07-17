<?php

namespace Modules\Homes\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Homes\Database\factories\HomeAgentsFactory;
use Modules\User\Models\User;

class HomeAgents extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'home_agent', 'home_id', 'agent_id'];

    public function agents()
    {
        return $this->belongsToMany(User::class, 'home_agent', 'home_id', 'agent_id');
    }
}
