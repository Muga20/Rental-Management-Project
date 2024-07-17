<?php

namespace Modules\User\Services;


use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Modules\User\Models\User;
use Modules\User\Models\UserRoles;

class RoleService
{
    public static function assignDefaultRole(User $user, string $defaultRoleName): JsonResponse
    {
        try {
            $defaultRole = DB::table('roles')->where('name', $defaultRoleName)->first();

            if ($defaultRole) {
                $userRole = new UserRoles();
                $userRole->user_id = $user->id;
                $userRole->role_id = $defaultRole->id;
                $userRole->save();

                return response()->json([
                    'success' => false,
                    'message' => 'Default role assigned successfully'], 200);
            } else {
                throw new \Exception('Default role not found.');
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign default role: ' . $e->getMessage()], 500);
        }
    }
}
