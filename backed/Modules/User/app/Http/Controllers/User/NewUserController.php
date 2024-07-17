<?php

namespace Modules\User\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Mail\NewAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Modules\Company\Models\Company;
use Modules\User\Jobs\GenerateAvatar;
use Modules\User\Models\NewUserSession;
use Modules\User\Models\User;
use Modules\User\Models\UserDetails;
use Modules\User\Services\RoleService;
use Modules\User\Traits\HandlesNotificationCreation;
use Modules\User\Jobs\GenerateCoverPhoto;

class NewUserController extends Controller
{
    use HandlesNotificationCreation;

    public function storeNewUser(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);

            $company_id = $data['company']->id;

            $this->createUser($request, $data);

            $user = User::where('email', $request->input('email'))->first();

            $company = Company::findOrFail($request->input('company_id'));

            // $this->sendNewAccountEmail($user, $company);

            Cache::forget("company_{$company_id}_users");

            return response()->json([
                'success' => true,
                'message' => 'User Created Successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function createUser(Request $request, $data)
    {
        $request->validate([
            'email' => 'required|email|unique:users|min:10',
            'first_name' => [
                'required',
                'string',
                'min:3',
                'regex:/^[^()<>]+$/',
            ],
            'last_name' => [
                'required',
                'string',
                'min:3',
                'regex:/^[^()<>]+$/',
            ],
            'company_id' => 'required|exists:companies,id',
            'phone_no' => [
                'required',
                'string',
                'unique:users,phone_no',
                'min:10'
            ],
        ]);

        $userRoles = $data['userRoles'];
        $company = $data['company'];
        $authUser = $data['user'];

        $userCount = $company->users()->count();

        if ($userCount >= 20) {
            return response()->json(['error' => 'Maximum number of users reached for this company'], 403);
        }

        $email = $request->input('email');
        $existingUser = User::where('email', $email)->first();

        if ($existingUser) {
            return response()->json(['error' => 'Email already exists.'], 400);
        }

        $user = new User();

        $user->fill([
            'email' => $email,
            'company_id' => $request->input('company_id'),
            'phone_no' => $request->input('phone_no'),
            'authType' => 'otp',
            'status' => 'inactive',
        ]);

        $user->save();

        $usernameBase = substr(Str::slug($request->input('first_name')), 0, 3);
        $username = $this->generateUniqueUsername($usernameBase);

        $userDetails = UserDetails::create([
            'user_id' => $user->id,
            'first_name' => $request->input('first_name'),
            'middle_name' => $request->input('middle_name'),
            'last_name' => $request->input('last_name'),
            'username' => $username,
            'id_number' => $request->input('id_number'),
            'is_verified' => 'false',
        ]);

        if (!$userDetails->profileImage) {
            Queue::push(new GenerateAvatar($userDetails));
            Queue::push(new GenerateCoverPhoto($userDetails));
        }

        RoleService::assignDefaultRole($user, 'user');

        $this->createNotification($user, $authUser, $userRoles);

        return response()->json(['success' => true, 'message' => 'User created successfully'], 201);
    }

    private function generateUniqueUsername($usernameBase)
    {
        $username = $usernameBase . '-' . Str::random(5);

        while (UserDetails::where('username', $username)->exists()) {
            $username = $usernameBase . '-' . Str::random(5);
        }

        return $username;
    }

    private function sendNewAccountEmail(User $user, Company $company)
    {
        $authLink = str_replace('.', '_', base64_encode($user->id . '|' . now()->timestamp . '|' . Str::random(40)));

        NewUserSession::create([
            'email' => $user->email,
            'token' => $authLink,
        ]);

        $resetLink = 'http://localhost:5173/auth/new-account/' . $authLink;

        Mail::to($user->email)->queue(new NewAccount($user, $company, $resetLink));
    }
}
