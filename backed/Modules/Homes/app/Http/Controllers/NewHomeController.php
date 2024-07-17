<?php

namespace Modules\Homes\Http\Controllers;

use App\Http\Controllers\Controller;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Modules\Homes\Jobs\GenerateCoverPhoto;
use Modules\Homes\Models\Home;
use Modules\Homes\Models\HomeAgents;
use Modules\Homes\Models\Units;

class NewHomeController extends Controller
{
    public function createNewHome(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'phone' => 'required|string|min:10',
                'images' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'houseCategory' => 'required|string|max:255',
                'location' => 'nullable|string|max:255',
                'stories' => 'nullable|integer|min:1',
                'description' => 'nullable|string',
                'number_of_units' => 'required|integer|min:1',
                'agent_id' => 'nullable|string',
            ]);

            // Retrieve common data or load as needed
            $data = $this->loadCommonData($request);
            $company = $data['company'];
            $ownerId = $data['user'];

            // Ensure company status is active
            if (!$company->status || $company->status !== 'active') {
                $company->update(['status' => 'active']);
            }

            // Check if phone or email already exists
            if (Home::where('phone', $request->input('phone'))->exists()) {
                return response()->json(['success' => false, 'message' => 'Phone number already exists'], 400);
            }

            if (Home::where('email', $request->input('email'))->exists()) {
                return response()->json(['success' => false, 'message' => 'Email already exists'], 400);
            }

            // Upload image to Cloudinary
            $image = $request->file('images');
            $uploadedImageUrl = Cloudinary::upload($image->getRealPath())->getSecurePath();

            // Create new Home
            $home = Home::create([
                'name' => $request->input('name'),
                'location' => $request->input('location'),
                'houseCategory' => $request->input('houseCategory'),
                'stories' => $request->input('stories') ?? 1, // Default to 1 if not provided
                'status' => 'available',
                'description' => $request->input('description'),
                'company_id' => $company->id,
                'phone' => $request->input('phone'),
                'email' => $request->input('email'),
                'slug' => Str::slug($request->input('name'), '-') . '-' . (Home::count() + 1),
                'landlord_id' => $ownerId->id,
                'images' => $uploadedImageUrl,
            ]);

            Queue::push(new GenerateCoverPhoto($home));

            if ($request->filled('agent_id')) {
                HomeAgents::create([
                    'home_id' => $home->id,
                    'agent_id' => $request->input('agent_id'),
                ]);
            }

            $numberOfUnits = $request->input('number_of_units');
            $totalUnits = $numberOfUnits * $home->stories;

            $units = [];

            for ($i = 1; $i <= $totalUnits; $i++) {
                $unitName = substr($home->name, 0, 2) . '-' . ceil($i / $numberOfUnits) . '-' . str_pad($i, 2, '0', STR_PAD_LEFT);
                $units[] = [
                    'id' => Str::uuid()->toString(),
                    'status' => 'vacant',
                    'slug' => $unitName,
                    'unit_name' => $unitName,
                    'home_id' => $home->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            Units::insert($units);

            return response()->json(['success' => true, 'message' => 'Home and units stored successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to store home and units: ' . $e->getMessage()], 500);
        }
    }

}
