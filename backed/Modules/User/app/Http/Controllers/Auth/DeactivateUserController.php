<?php

namespace Modules\User\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ActivateAcc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Modules\User\Models\User;

class DeactivateUserController extends Controller
{
    public function deactivateMyAccount(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validate the incoming request
            $request->validate([
                'password' => 'required|string', // Add password validation rule
            ]);

            $data = $this->loadCommonData($request);
            $user = $data['user'];

            // Check if the provided password matches the user's password
            if (!Hash::check($request->input('password'), $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Incorrect password.',
                ], 400);
            }

            // Update user status to deactivated
            $user->update([
                'authType' => 'token',
                'status' => 'deactivated',
                'updated_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Account deactivated successfully.',
            ], 200);

        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'An error occurred. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function sendToken(Request $request)
    {
        try {
            $user = User::where('email', $request->input('email'))->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found.',
                ], 404);
            }

            Mail::to($user->email)->send(new ActivateAcc($user, $user->company));

            return response()->json([
                'success' => true,
                'message' => 'Account backup email sent successfully. Please check your inbox.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send backup email.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
