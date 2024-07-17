<?php

namespace Modules\User\Traits;

use Tymon\JWTAuth\Facades\JWTAuth;

trait Auth
{
    protected function handleAuthentication($user, $request)
    {
        $company = $user->company;

        if (!$company) {
            return $this->handleAuthenticationFailure('Unauthorized - Invalid company');
        }

        $roles = $user->roles()->pluck('name');

        if ($roles->isEmpty()) {
            return $this->handleAuthenticationFailure('Unauthorized - User does not have a valid role');
        }

        // Generate access token
        $accessToken = $this->generateJwtToken($user);

        return response()->json([
            'message' => 'Success',
            'token' => $accessToken,
        ]);
    }

    private function handleAuthenticationFailure($errorMessage)
    {
        return response()->json(['error' => $errorMessage], 401);
    }

    private function updateLastLogin($user, $location)
    {
        try {
            $user->last_login_at = now();
            $user->last_login_location = $location;
            $user->save();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update last login: ' . $e->getMessage()], 500);
        }
    }

    protected function generateJwtToken($user)
    {
        $customClaims = [
            'user_id' => $user->id,
            'exp' => now()->addMinutes(config('jwt.ttl'))->timestamp,
        ];

        $token = JWTAuth::claims($customClaims)->fromUser($user);

        return $token;
    }


}
