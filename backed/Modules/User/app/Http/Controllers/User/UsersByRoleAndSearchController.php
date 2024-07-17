<?php

namespace Modules\User\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\User\Models\Roles;

class UsersByRoleAndSearchController extends Controller
{
    public function getUsersByRoleAndSearch(Request $request, $role)
    {
        try {
            $keyword = $request->input('keyword');
            $status = $request->input('status');
            $page = $request->input('page', 1);

            $selectedRole = Roles::where('name', $role)->first();

            if (!$selectedRole) {
                return response()->json(['success' => false, 'message' => 'Role not found'], 404);
            }

            $query = $selectedRole->users()->with('detail')->with('company')->with('roles');

            if ($keyword) {

                $query->whereHas('detail', function ($q) use ($keyword) {
                    $q->whereRaw("CONCAT(first_name, ' ', middle_name, ' ', last_name) LIKE ?", ["%{$keyword}%"]);
                })->orWhere('email', 'like', "%{$keyword}%");
            }

            if ($status) {
                $query->where('status', $status);
            }

            $roleList = $query->paginate(10, ['*'], 'page', $page);
            $roleList->appends($request->only(['keyword', 'status', 'page']));

            return response()->json([
                'data' => [
                    'roleList' => $roleList,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch roles: ' . $e->getMessage()], 500);
        }
    }
}
