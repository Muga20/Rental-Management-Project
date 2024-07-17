<?php

namespace Modules\User\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Modules\User\Models\User;

class AccountSettingsController extends Controller
{

    public function updateSecurity(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);

            $request->validate([
                'password' => 'required|min:6',
                'newPassword' => ['required',
                    Password::min(8)->letters()->numbers()->mixedCase()->symbols(),
                ],
                'confirmPassword' => 'required|same:newPassword',
            ]);

            $password = $request->input('password');
            $newPassword = $request->input('newPassword');

            // Check if the newPassword key is present in the data array
            if (!$newPassword) {
                return response()->json(['success' => false, 'message' => 'Invalid request data.'], 400);
            }

            $user = $data['user'];

            if ($user['password'] === null) {
                $user->update([
                    'password' => Hash::make($newPassword),
                    'authType' => 'password',
                    'otp' => null,
                ]);
            } else {

                // Check if the current password is correct
                if (!Hash::check($password, $user->password)) {
                    return response()->json(['success' => false, 'message' => 'Current password is incorrect.'], 400);
                }

                // Check if the new password is the same as the current password
                if (Hash::check($newPassword, $user->password)) {
                    return response()->json(['success' => false, 'message' => 'New password cannot be the same as the current password.'], 400);
                }

                // Update user password
                $user->update([
                    'password' => Hash::make($newPassword),
                    'status' => 'active',
                ]);

            }

            return response()->json(['success' => true, 'message' => 'Password updated successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update password: ' . $e->getMessage()], 500);
        }
    }

    public function updateEmailSecurity(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);

            $company_id = $data['company'];
            $user = $data['user'];
            
            $userId = $user->id;

            $request->validate([
                'email' => 'required|email|min:6',
            ]);

            $email = $request->input('email');



            $emailExists = User::where('email', $email)->exists();

            if ($emailExists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email already in use.',
                ], 400);
            }

            $user->update([
                'email' => $email,
                'status' => 'active',
            ]);

            $cacheKey = "user_{$userId}_id";
            Cache::store('redis')->forget($cacheKey);

            Cache::forget("company_{$company_id}_users");



            return response()->json(['success' => true, 'message' => 'Email updated successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update your email: ' . $e->getMessage()], 500);
        }
    }

    public function setAuthType(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);

            $request->validate([
                'auth_type' => 'required|in:otp,password',
            ]);

            $authType = $request->input('auth_type');
            $user = $data['user'];
            $company = $data['company']->name;

            // Check if user is trying to set OTP as auth type while two_fa_status is active
            if ($authType === 'otp') {
                if ($user->two_fa_status === 'active') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Two-factor authentication is already active. Please deactivate it first before changing to OTP.'], 400);
                }
            }

            // Check if user is trying to set password without a password being set
            if ($authType === 'password') {
                if (!$user->password) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You need to set a password first on the security option.'], 400);
                }
            }

            $user->authType = $authType;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Authentication type updated successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update Authentication: ' . $e->getMessage()], 500);
        }
    }

    public function twoFaSetup(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);

            $smsNumber = $request->input('phone_no');
            $twoFaStatus = $request->input('two_fa_status');

            $user = $data['user'];

            if (!preg_match('/^07\d{8}$/', $smsNumber)) {
                return response()->json([
                    'success' => false,
                    'message' => 'The phone number must start with "07" and be followed by 8 digits.'], 400);
            }

            $existingUser = User::where('phone_no', $smsNumber)->first();
            if ($existingUser && $existingUser->id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'This phone number is already in use.'], 400);
            }

            if ($user->authType === 'password') {
                if ($twoFaStatus === 'inactive') {
                    if (!$smsNumber) {
                        return response()->json([
                            'success' => false,
                            'message' => 'You need to provide an SMS number for two-factor authentication'], 400);
                    } else {
                        $user->phone_no = $smsNumber;
                    }
                    $user->two_fa_status = 'active';
                } elseif ($twoFaStatus === 'active') {
                    if ($user->two_fa_status === 'active') {
                        $user->two_fa_status = 'inactive';
                        $user->phone_no = null;
                    } else {
                        return response()->json([
                            'success' => false,
                            'message' => 'Two-factor authentication is already inactive.'], 400);
                    }
                }

                $user->save();


                return response()->json([
                    'success' => true,
                    'message' => 'Two-factor authentication settings updated successfully.'], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Two-factor authentication can only be managed for users with password authentication.'], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update two-factor authentication settings: ' . $e->getMessage()], 500);
        }
    }
}
