<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Modules\Communication\Models\UserChannels;
use Modules\User\Jobs\GenerateAvatar;
use Modules\User\Models\UserDetails;
use Illuminate\Support\Facades\Queue;

class UserController extends Controller
{

    public function getAuthenticatedUser(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);

            $user = $data['user'];
            $userRoles = $data['userRoles'];
            $userId = $user->id;

            $cacheKey = "user_{$userId}_id";

            // Check if the data is already cached
            if (Cache::store('redis')->has($cacheKey)) {
                $channels = Cache::store('redis')->get($cacheKey);
            } else {
                // Eager load the 'channel' relationship to fetch channels directly
                $userChannels = UserChannels::with('channel')
                    ->where('user_id', $userId)
                    ->get();

                $channels = $userChannels->map(function ($channelUser) {
                    return [
                        'channel_id' => $channelUser->channel->id,
                        'channel_name' => $channelUser->channel->channel_name,
                        'event' => $channelUser->channel->event,
                    ];
                });

                // Cache the result
                Cache::store('redis')->put($cacheKey, $channels, now()->addMinutes(10));
            }

            return response()->json([
                'data' => [
                    'user' => $user,
                    'roles' => $userRoles,
                    'channels' => $channels,
                ],
            ], 200);
        } catch (\Exception $e) {
            // Return a JSON response with the error message and a 500 status code
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user profile: ' . $e->getMessage()], 500);
        }
    }


    public function updateUser(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);

            $validatedData = $request->validate([
                'first_name' => ['nullable', 'string', 'max:255', 'min:2', 'regex:/^[a-zA-Z\-\'\s]+$/'],
                'middle_name' => ['nullable', 'string', 'max:255', 'min:2', 'regex:/^[a-zA-Z\-\'\s]+$/'],
                'last_name' => ['nullable', 'string', 'max:255', 'min:2', 'regex:/^[a-zA-Z\-\'\s]+$/'],
                'date_of_birth' => ['nullable', 'date'],
                'id_number' => ['nullable', 'string', 'max:16'],
                'username' => ['nullable', 'string', 'max:8', 'alpha_dash'],
                'address' => ['nullable', 'string', 'max:255', 'regex:/^[a-zA-Z\-\'\s]+$/'],
                'phone_no' => ['nullable', 'string', 'max:15'],
                'gender' => ['nullable', 'string', 'in:male,female,other'],
                'location' => ['nullable', 'string', 'max:50', 'regex:/^[a-zA-Z\-\'\s]+$/'],
                'about_the_user' => ['nullable', 'string', 'regex:/^[a-zA-Z\-\'\s]+$/'],
            ]);

            $company_id = $data['company']->id;
            $user = $data['user'];

            // Prepare user data for updating
            $userData = array_merge($validatedData, [
                'company_id' => $company_id,
                'status' => $user->status,
            ]);

            // Prepare user data for updating (for users table)
            $userUpdateData = [
                'phone_no' => $validatedData['phone_no'] ?? $user->phone_no,
            ];

            $user->update($userUpdateData);

            $userDetails = UserDetails::where('user_id', $user->id)->firstOrFail();

            if ($request->has('id_number')) {
                $existingIdNumberTenant = UserDetails::where('id_number', $request->input('id_number'))
                    ->where('user_id', '!=', $user->id)
                    ->first();

                if ($existingIdNumberTenant) {
                    return response()->json([
                        'success' => false,
                        'message' => 'ID number already exists',
                    ], 400);
                }
            }

            if ($request->has('date_of_birth')) {
                $dateOfBirth = date('Y-m-d', strtotime($request->input('date_of_birth')));
                $userData['date_of_birth'] = $dateOfBirth;

                $dob = new \DateTime($dateOfBirth);
                $today = new \DateTime();
                $age = $dob->diff($today)->y;

                if ($age < 18) {
                    return response()->json([
                        'success' => false,
                        'message' => 'User must be 18 years or older',
                    ], 400);
                }
            }

            $userDetails->update($userData);

            return response()->json([
                'success' => true,
                'message' => 'User details updated successfully.',
            ], 200);

        } catch (\Exception $e) {
            // Handle other exceptions
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateProfileImage(Request $request)
    {
        try {
            // Validate the incoming request
            $request->validate([
                'profileImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            $data = $this->loadCommonData($request);

            $user = $data['user'];

            // Find the user details
            $userDetails = UserDetails::where('user_id', $user->id)
                ->firstOrFail();

            // Handle profile image upload
            if ($request->hasFile('profileImage')) {
                $image = $request->file('profileImage');
                $uploadedImageUrl = Cloudinary::upload($image->getRealPath())->getSecurePath();
                // Assuming $company is the instance where you want to store the image URL
                $userDetails->profileImage = $uploadedImageUrl;
                $userDetails->save();
            }

            // Return a success response
            return response()->json([
                'success' => false,
                'message' => 'Profile image updated successfully.'], 200);

        } catch (\Exception $e) {
            // Handle other exceptions
            return response()->json([
                'success' => false,
                'message' => 'Failed to update image: ' . $e->getMessage()], 500);
        }
    }

    public function removeImage(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);

            $user = $data['user'];

            // Find the user details
            $userDetails = UserDetails::where('user_id', $user->id)->firstOrFail();

            // Check if the user already has a profile image
            if (!$userDetails->profileImage) {
                return response()->json([
                    'success' => false,
                    'message' => 'User does not have a profile image.',
                ], 400);
            }


            $userDetails->profileImage = null;

            $userDetails->save();

            if (!$userDetails->profileImage) {
                Queue::push(new GenerateAvatar($userDetails));
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile image removed successfully.',
            ], 200);

        } catch (\Exception $e) {
            // Handle exceptions
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove profile image: ' . $e->getMessage(),
            ], 500);
        }
    }

}
