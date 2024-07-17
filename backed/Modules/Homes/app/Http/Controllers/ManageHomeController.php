<?php

namespace Modules\Homes\Http\Controllers;

use App\Http\Controllers\Controller;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Modules\Homes\Models\Home;
use Modules\Homes\Models\HomeAgents;
use Modules\Homes\Models\HomeCareTakers;

class ManageHomeController extends Controller
{
    public function editedHome(Request $request, $home_id)
    {
        $request->validate([
            'name' => 'nullable|string',
            'location' => 'nullable|string',
            'houseCategory' => 'nullable|string',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|min:10',
            'email' => 'nullable|email',
            // 'images' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            $home = Home::findOrFail($home_id);

            if ($request->input('phone') != $home->phone && Home::where('phone', $request->input('phone'))->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Phone number already exists',
                ], 400);
            }

            if ($request->input('email') != $home->email && Home::where('email', $request->input('email'))->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email already exists',
                ], 400);
            }

            if ($request->hasFile('images')) {
                $image = $request->file('images');
                $uploadedImageUrl = Cloudinary::upload($image->getRealPath())->getSecurePath();
                $home->images = $uploadedImageUrl;
            }

            $home->update([
                'name' => $request->input('name', $home->name),
                'location' => $request->input('location', $home->location),
                'houseCategory' => $request->input('houseCategory', $home->houseCategory),
                'description' => $request->input('description', $home->description),
                'phone' => $request->input('phone', $home->phone),
                'email' => $request->input('email', $home->email),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Home details updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update home details' . $e->getMessage(),
            ], 500);
        }
    }

    public function addNewAgent(Request $request, $home_id)
    {
        $request->validate([
            'agent_id' => 'required|exists:users,id',
        ]);

        try {
            $home = Home::findOrFail($home_id);

            $existingAgent = HomeAgents::where('home_id', $home->id)
                ->where('agent_id', $request->input('agent_id'))
                ->first();

            if ($existingAgent) {
                return response()->json([
                    'success' => false,
                    'message' => 'Agent already assigned to this home.',
                ], 400);
            }

            $agent = new HomeAgents();
            $agent->home_id = $home->id;
            $agent->agent_id = $request->input('agent_id');

            $agent->save();

            return response()->json([
                'success' => true,
                'message' => 'Agent added successfully',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Home not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add agent: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function removeAgent($agent_id)
    {
        try {

            $agent = HomeAgents::where('agent_id', $agent_id)->firstOrFail();

            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'Agent not found.',
                ], 404);
            }

            $agent->delete();

            return response()->json([
                'success' => true,
                'message' => 'Agent removed successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove agent: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function addNewCareTaker(Request $request, $home_id)
    {
        $request->validate([
            'care_taker_id' => 'required|exists:users,id',
        ]);

        try {
            $home = Home::findOrFail($home_id);

            $existingCareTaker = HomeCareTakers::where('home_id', $home->id)
                ->where('care_taker_id', $request->input('care_taker_id'))
                ->first();

            if ($existingCareTaker) {
                return response()->json([
                    'success' => false,
                    'message' => 'Care Taker already exists for this home',
                ], 400);
            }

            $careTaker = new HomeCareTakers();
            $careTaker->home_id = $home->id;
            $careTaker->care_taker_id = $request->input('care_taker_id');

            $careTaker->save();

            return response()->json([
                'success' => true,
                'message' => 'Care Taker added successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add care taker: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function removeCareTaker($careTakerId)
    {
        try {
            $careTaker = HomeCareTakers::where('care_taker_id', $careTakerId)->firstOrFail();
            $careTaker->delete();

            return response()->json([
                'success' => true,
                'message' => 'Care Taker removed successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove care taker: ' . $e->getMessage(),
            ], 500);
        }
    }
}
