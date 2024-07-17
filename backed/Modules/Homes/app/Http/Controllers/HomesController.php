<?php

namespace Modules\Homes\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Homes\Models\Home;
use Modules\User\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class HomesController extends Controller
{
    public function HomeProfile(Request $request, $home_id)
    {
        try {
            $data = $this->loadCommonData($request);

            // Load home details with units count
            $home = Home::withCount('units')
                        ->where('id', $home_id)
                        ->firstOrFail();

            // Count vacant units
            $vacantUnits = $home->units()
                                ->where('status', 'vacant')
                                ->count();

            // Load agent users with details
            $agentUsers = $home->agents()
                               ->with('detail')
                               ->get();

            // Load caretakers with details
            $careTakers = $home->caretakers()
                               ->with('detail')
                               ->get();

            return response()->json([
                'data' => [
                    'home' => $home,
                    'vacantUnits' => $vacantUnits,
                    'agentUsers' => $agentUsers,
                    'careTakers' => $careTakers,
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Home not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
