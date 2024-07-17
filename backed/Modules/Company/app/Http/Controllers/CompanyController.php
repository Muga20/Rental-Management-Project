<?php

namespace Modules\Company\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Company\Models\Company;

class CompanyController extends Controller
{
    public function showAvailableCompanies(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);
            $keyword = $request->input('keyword');
            $page = $request->input('page', 1);
            $perPage = 15;
            $status = $request->input('status');
            $location = $request->input('location');

            $companiesQuery = Company::query()
                ->where('name', 'like', "%{$keyword}%")
                ->where('status', 'like', "%{$status}%");

            if ($location !== null) {
                $companiesQuery->where('location', 'like', "%{$location}%");
            }

            $companies = $companiesQuery->withCount('users')
                ->latest()
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'data' => [
                    'companies' => $companies,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching the companies data.' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $companyId)
    {
        try {
            $company = Company::findOrFail($companyId);
            $company->delete();

            return response()->json([
                'success' => true,
                'message' => 'Company deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete company' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Deactivate the specified resource in storage.
     */
    public function deactivate(Request $request, $companyId)
    {
        try {
            $company = Company::findOrFail($companyId);

            if ($company->status === 'active') {
                $company->status = 'inactive';
                $message = 'Company deactivated successfully';
            } else {
                $company->status = 'active';
                $message = 'Company activated successfully';
            }

            $company->save();

            return response()->json([
                'success' => true,
                'message' => $message,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle company status' . $e->getMessage(),
            ], 500);
        }
    }

}
