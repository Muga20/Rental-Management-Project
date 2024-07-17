<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
use Modules\User\Models\User;
use App\Helpers\ApiResponse;

class JwtMiddleware extends BaseMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $tokenString = $request->bearerToken();

        if (!$tokenString) {
            return ApiResponse::error('JWT token not found in headers.', 401);
        }

        try {
            $payload = JWTAuth::parseToken()->getPayload();
            $userId = $payload->get('user_id');

            if (!$userId) {
                return ApiResponse::error('User ID not found in token', 401);
            }

            $user = User::with(['detail'])->find($userId);

            if (!$user) {
                return ApiResponse::error('User not found', 404);
            }

            // Example: Check user status
            if ($user->status === 'deactivated') {
                return ApiResponse::error('Account is deactivated', 403);
            }

            // Add additional checks or processing as needed

            $request->attributes->add([
                'authenticated_user' => $user,
                'user_roles' => $user->roles()->pluck('name')->toArray(),
            ]);

            return $next($request);

        } catch (TokenExpiredException $e) {
            return ApiResponse::error('Token expired', 401);
        } catch (TokenInvalidException $e) {
            return ApiResponse::error('Invalid token', 401);
        } catch (JWTException $e) {
            return ApiResponse::error('Failed to decode token', 500);
        }
    }
}

