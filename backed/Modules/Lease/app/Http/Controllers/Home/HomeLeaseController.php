<?php

namespace Modules\Lease\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Modules\Homes\Jobs\GenerateCoverPhoto;
use Modules\Homes\Models\Units;
use Modules\Lease\Models\HomeLease;
use Modules\User\Jobs\GenerateAvatar;
use Modules\User\Models\User;
use Modules\User\Models\UserDetails;
use Modules\User\Services\RoleService;

class HomeLeaseController extends Controller
{
    public function getWhoHasleasedAUnitForTest($unit_id)
    {
        try {
            $lease = HomeLease::with(['unit', 'user.detail'])
                ->where('unit_id', $unit_id)
                ->first();

            // if (!$lease) {
            //     return response()->json([
            //         'success' => false,
            //         'message' => 'No lease found for the specified Unit.',
            //     ], 404);
            // }

            return response()->json(['data' => ['lease' => $lease, ],], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve tenant lease. Please try again.',
            ], 500);
        }
    }

    public function getWhoHasleasedAUnitForProduction($tenant_id)
    {
        try {
            $lease = HomeLease::with('unit', 'user')
                ->where('user_id', $tenant_id)
                ->first();

            if (!$lease) {
                return response()->json([
                    'success' => false,
                    'message' => 'No lease found for the specified tenant.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $lease,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve tenant lease. Please try again.',
            ], 500);
        }
    }
    public function leaseAHomeToTenant(Request $request, $unit_id)
    {
        $request->validate([
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
                'min:10',
            ],
        ]);

        $data = $this->loadCommonData($request);

        $company = $data['company'];
        $company_id = $data['company'];

        try {

            $existingIdNumberTenant = UserDetails::where('id_number', $request->input('id_number'))->first();
            if ($existingIdNumberTenant) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID number already exists',
                ], 400);
            }

            $dob = new DateTime($request->input('date_of_birth'));
            $today = new DateTime();
            $age = $dob->diff($today)->y;

            if ($age < 18) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tenant must be 18 years or older',
                ], 400);
            }

            $newTenant = new User();
            $newTenant->authType = 'otp';
            $newTenant->status = 'active';
            $newTenant->company_id = $company->id;
            $newTenant->two_fa_status = 'inactive';
            $newTenant->phone_no = $request->input('phone_no');
            $newTenant->save();

            RoleService::assignDefaultRole($newTenant, 'user');
            RoleService::assignDefaultRole($newTenant, 'tenant');

            $usernameBase = substr(Str::slug($request->input('first_name')), 0, 3);
            $username = $this->generateUniqueUsername($usernameBase);

            $userDetails = new UserDetails();
            $userDetails->user_id = $newTenant->id;
            $userDetails->first_name = $request->input('first_name');
            $userDetails->middle_name = $request->input('middle_name');
            $userDetails->last_name = $request->input('last_name');
            $userDetails->is_verified = "false";
            $userDetails->username = $username;
            $userDetails->date_of_birth = $request->input('date_of_birth');
            $userDetails->id_number = $request->input('id_number');
            $userDetails->country = $request->input('country');
            $userDetails->gender = $request->input('gender');
            $userDetails->save();

            if (!$userDetails->profileImage) {
                Queue::push(new GenerateAvatar($userDetails));
                Queue::push(new GenerateCoverPhoto($userDetails));
            }

            Cache::forget("company_{$company_id}_users");

            try {
                $unit = Units::findOrFail($unit_id);

                if ($unit->status === 'occupied') {
                    return response()->json([
                        'success' => false,
                        'message' => 'This unit is already occupied.',
                    ], 400);
                }

                $lease = HomeLease::create([
                    'unit_id' => $unit_id,
                    'user_id' => $newTenant->id,
                    'start_date' => date("Y/m/d"),
                ]);

                $unit->update([
                    'status' => 'occupied',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Tenant rented successfully.',
                ], 200);
            } catch (Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to rent tenant. Please try again.',
                ], 500);
            }

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create tenant',
            ], 500);
        }
    }

    private function generateUniqueUsername($usernameBase)
    {
        $username = $usernameBase . '-' . Str::random(5);

        while (UserDetails::where('username', $username)->exists()) {
            $username = $usernameBase . '-' . Str::random(5);
        }

        return $username;
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'end_date' => 'nullable|date',
            'rent_deposit' => 'nullable|numeric',
            'additional_fees' => 'nullable|numeric',
        ]);

        $lease = HomeLease::findOrFail($id);
        $lease->update($request->all());

        return response()->json($lease);
    }

    public function terminateLease($id)
    {
        try {
            $lease = HomeLease::findOrFail($id);

            $unit_id = $lease->unit_id;

            $unit = Units::findOrFail($unit_id);

            // Perform any other necessary operations related to terminating the lease,
            // e.g., deleting the lease record
            DB::beginTransaction();

            try {
                $lease->delete();

                $unit->update(['status' => 'vacant']);

                DB::commit();

                return response()->json(['success' => true, 'message' => 'Tenant successfully removed.']);

            } catch (\Exception $e) {
                DB::rollback();

                return response()->json([
                    'message' => 'An error occurred while terminating the lease.',
                    'error' => $e->getMessage()
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while terminating the lease.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
