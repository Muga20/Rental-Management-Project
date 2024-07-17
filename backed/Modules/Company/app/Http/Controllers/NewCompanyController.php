<?php

namespace Modules\Company\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Modules\Company\Models\Company;
use Illuminate\Support\Facades\Validator;

class NewCompanyController extends Controller
{
    public function newCompany(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first(),
                ], 422);
            }

            $validatedData = $validator->validated();
            $validatedData['status'] = 'inactive';

            $slug = Str::slug($validatedData['name']);
            $suffix = 1;
            while (Company::where('slug', $slug)->exists()) {
                $slug = Str::slug($validatedData['name']) . '-' . $suffix++;
            }

            $company = new Company();
            $company->fill($validatedData);

            $randomNumber = 'cm' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);

            $company->companyId = $randomNumber;
            $company->slug = $slug;

            // $image = $request->file('logoImage');
            // $uploadedImageUrl = Cloudinary::upload($image->getRealPath())->getSecurePath();
            // $company->logoImage = $uploadedImageUrl;

            $company->save();

            return response()->json([
                'success' => true,
                'message' => 'Company Created Successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create company. Please try again.'.$e->getMessage(),
            ], 500);
        }
    }
}
