<?php

namespace Modules\User\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Modules\User\Models\NewUserSession;
use Modules\User\Models\User;
use Modules\User\App\Traits\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthNewUserController extends Controller
{
    use AuthTrait;

    public function ConfirmAuthNewUser(Request $request, $authLink)
    {
        $email = $request->input('email');

        $user = User::where('email', $email)->first();

        if (!$user) {
            return $this->handleAuthenticationFailure('User not found.');
        }

        if (!in_array($user->authType, ['otp', 'token'])) {
            if (empty($user->authType)) {
                return $this->handleAuthenticationFailure('Unauthorized - Invalid authentication type');
            }
        }

        if ($user->authType === 'otp') {

            // Find the token in the database
            $tokenData = NewUserSession::where('token', $authLink)->first();

            if (!$tokenData) {
                return response()->json(['error' => 'Invalid or expired token.'], 400);
            }

            $user = User::where('email', $compressedEmail)->first();

            if (!$user) {
                return response()->json(['error' => 'User not found.'], 404);
            }

            $user->update(['authType' => "password"]);

            // Invalidate the token
            $tokenData->delete();

            return $this->handleAuthentication($user, $request);

        } else {
            return $this->handleAuthenticationFailure('Unauthorized - Invalid credentials');
        }
    }

}
