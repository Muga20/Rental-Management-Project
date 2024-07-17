<?php

namespace App\Http\Controllers;

use App\Traits\RequiredRoles;
use App\Traits\AuthenticatedUser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthenticatedUser;
    use RequiredRoles;

    /**
     * Load common data including authenticated user, user roles, and company.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function loadCommonData(Request $request)
    {
        // Access authenticated user, user roles, and company from request attributes
        $user = $request->attributes->get('authenticated_user');
        $userRoles = $request->attributes->get('user_roles');

        // Example usage
        return ([
            'user' => $user,
            'userRoles' => $userRoles,
            'company' => $user->company,
        ]);
    }

}
