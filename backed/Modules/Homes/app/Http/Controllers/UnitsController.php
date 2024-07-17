<?php

namespace Modules\Homes\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Homes\Models\Home;

class UnitsController extends Controller
{
    public function getHomeUnits(Request $request, $home)
    {
        try {
            $keyword = $request->input('keyword');

            // Eager load units with user details and roles in one query
            $homeWithUnits = Home::with([
                'units' => function ($query) use ($keyword) {
                    if ($keyword) {
                        $query->where('unit_name', 'like', "%{$keyword}%");
                    }
                    $query->latest();
                },
                'units.user.details',
                'units.user.roles',
            ])->findOrFail($home);

            $homeUnits = $homeWithUnits->units()->paginate(16);

            return response()->json([
                'data' => [
                    'units' => $homeUnits,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Internal Server Error',
            ], 500);
        }
    }
}
