<?php

namespace Modules\Homes\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Homes\Models\Home;

class ShowHomeController extends Controller
{
    public function showHomes(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);
            $keyword = $request->input('keyword');
            $companyId = $data['company']->id;

            $query = Home::withCount('units')
                ->where('company_id', $companyId)
                ->latest();

            if ($keyword) {
                $query->where(function ($q) use ($keyword) {
                    $q->where('name', 'like', "%{$keyword}%")
                        ->orWhere('location', 'like', "%{$keyword}%");
                });
            }

            $allHouses = $query->paginate(10);
            $allHouses->appends(['keyword' => $keyword]);

            foreach ($allHouses as $house) {
                if ($house->units->where('status', 'occupied')->count() == $house->units->count()) {
                    $house->status = 'fully occupied';
                } else {
                    $house->status = 'available';
                }
            }

            return response()->json([ 'data' => ['allHouses' => $allHouses]], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false ,
                'message' => 'An error occurred while fetching the houses data.' . $e->getMessage(),
            ], 500);
        }
    }
}
