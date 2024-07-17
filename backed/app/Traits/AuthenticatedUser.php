<?php

namespace App\Traits;

use Modules\User\Models\User;

trait AuthenticatedUser
{
    private function getUserAndCompany($request)
    {
        $payload = $request->attributes->get('jwt_payload');
        $userId = $payload->user_id;

        $user = User::with(['company', 'detail'])->find($userId);

        if (!$user || !$user->company || !$user->detail) {
            return response()->json([
                'success' => false,
                'success' => 'User or company not found'], 404);
        }

        $userRoles = $user->roles()->pluck('name');

        if ($userRoles->isNotEmpty()) {
            $company = $user->company;
            return [$user, $company, $userRoles->toArray()];
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'], 403);
    }
}
