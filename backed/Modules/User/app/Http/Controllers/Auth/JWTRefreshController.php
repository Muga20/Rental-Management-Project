<?php

namespace Modules\User\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JWTRefreshController extends Controller
{
    public function refreshToken(Request $request)
    {
        $refreshToken = $request->input('token');

        try {

            $payload = JWTAuth::setToken($refreshToken)->getPayload();
            $userId = $payload->get('sub');

            if (!$userId) {
                return response()->json(['success' => false, 'message' => 'Invalid token'], 401);
            }

            $customClaims = [
                'user_id' => $userId,
                'exp' => now()->addMinutes(config('jwt.ttl'))->timestamp,
            ];

            $newToken = JWTAuth::claims($customClaims)->refresh($refreshToken);

            return response()->json([
                'access_token' => $newToken,
            ]);

        } catch (TokenExpiredException $e) {
            return response()->json(['success' => false, 'message' => 'Refresh token has expired'], 401);
        } catch (JWTException $e) {
            return response()->json(['success' => false, 'message' => 'Failed to refresh token'], 401);
        }
    }
}
