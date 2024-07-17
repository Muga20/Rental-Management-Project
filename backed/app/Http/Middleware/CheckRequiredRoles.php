<?php

// app/Http/Middleware/CheckRequiredRoles.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Traits\RequiredRoles;

class CheckRequiredRoles
{
    use RequiredRoles;

    public function handle(Request $request, Closure $next, $tier)
    {
        $requiredRoles = $this->rolesThatMustHave($tier);
        $userRoles = $request->user()->roles()->pluck('name')->toArray();

        foreach ($requiredRoles as $role) {
            if (in_array($role, $userRoles)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized: Insufficient privileges.'], 403);
    }
}
