<?php

namespace Modules\User\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPassword;
use Modules\User\Traits\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Modules\User\Models\PasswordResetToken;
use Modules\User\Models\User;
use Illuminate\Validation\Rules\Password;


class ResetPasswordController extends Controller
{
    use Auth;

    public function sendResetPasswordEmail(Request $request)
    {
        try {
            $data = $request->all();

            $user = User::where('email', $data['email'])->first();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found.'], 404);
            }

            if ($user->two_fa_status === 'active') {
                $user->two_fa_status = 'inactive';
                $user->save();
            }

            // Generate unique token
            $token = str_replace('.', '_', base64_encode($user->id . '|' . now()->timestamp . '|' . Str::random(40)));

            PasswordResetToken::create([
                'email' => $user->email,
                'token' => $token,
            ]);

            $resetLink = 'http://localhost:5173/auth/new-password/' . $token;

            Mail::to($user->email)->queue((new ForgotPassword($user, $resetLink)));

            return response()->json(['success' => true, 'message' => 'Password reset email sent successfully. Please check your inbox.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to send password reset email: ' . $e->getMessage()], 500);
        }
    }

    public function newPassword(Request $request, $token)
    {
        try {
            $request->validate([
                'newPassword' => ['required',
                Password::min(8)->letters()->numbers()->mixedCase()->symbols(),
            ],
                'confirmPassword' => 'required|same:newPassword',
                'authStatus' => 'required',
            ]);

            $newPassword = $request->input('newPassword');
            $authStatus = $request->input('authStatus');

            if (isset($authStatus) && $authStatus === 'authOn') {

                $data = $this->loadCommonData($request);
                $loggedInUser = $data['user'];

                $loggedInUser->password = Hash::make($newPassword);
                $loggedInUser->save();

                return response()->json(['success' => true, 'message' => 'Password updated successfully.'], 200);

            } elseif (isset($authStatus) && $authStatus === 'authOff') {

                // Find the token in the database
                $tokenData = PasswordResetToken::where('token', $token)->first();

                if (!$tokenData) {
                    return response()->json(['success' => false, 'message' => 'Invalid or expired token.'], 400);
                }

                $user = User::where('email', $tokenData->email)->first();

                if (!$user) {
                    return response()->json(['success' => false, 'message' => 'User not found.'], 404);
                }

                $user->password = Hash::make($newPassword);
                $user->save();

                // Invalidate the token
                $tokenData->delete();

                return $this->handleAuthentication($user, $request);
            } else {
                return response()->json(['success' => false, 'message' => 'Invalid authentication status.'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update password: ' . $e->getMessage()], 500);
        }
    }
}
