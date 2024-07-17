<?php

namespace Modules\User\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;
use Modules\Company\Models\Company;
use Modules\User\Models\User;

class DashboardController extends Controller
{
    public function dashboardStarts()
    {
        $activeUsersCount = User::where('status', 'active')->count();
        $usersCount = User::count();
        $customersCount = User::count();
        $companiesCount = Company::count();

        $usersPercentage = $usersCount > 0 ? ($activeUsersCount / $usersCount) * 100 : 0;
        $customersPercentage = $customersCount > 0 ? ($activeUsersCount / $customersCount) * 100 : 0;
        $companiesPercentage = $companiesCount > 0 ? ($activeUsersCount / $companiesCount) * 100 : 0;

        return response()->json([
            'activeUsersCount' => $activeUsersCount,
            'usersCount' => $usersCount,
            'customersCount' => $customersCount,
            'companiesCount' => $companiesCount,
            'usersPercentage' => $usersPercentage,
            'customersPercentage' => $customersPercentage,
            'companiesPercentage' => $companiesPercentage,
        ]);
    }

    public function index(Request $request)
    {
        $data = $this->loadCommonData($request);

        $uptimeOutput = shell_exec('uptime');
        preg_match('/up\s+([^,]+)/', $uptimeOutput, $matches);
        $uptime = isset($matches[1]) ? trim($matches[1]) : 'Uptime information not available';

        $firstSeenFormatted = isset($data['first_seen']) ? date('d M Y, g:iA', strtotime($data['first_seen'])) : 'N/A';
        $collectedTimeFormatted = isset($data['collected_time']) ? date('d M Y, g:iA', strtotime($data['collected_time'])) : 'N/A';

        $dashboardData = $this->dashboardStarts()->getData();

        return response()->json([
            'uptime' => $uptime,
            'firstSeenFormatted' => $firstSeenFormatted,
            'collectedTimeFormatted' => $collectedTimeFormatted,
            'dashboardData' => $dashboardData,
        ] + $data);
    }

    public function stuff(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);
            $company_id = $data['company']->id;

            $usersInCompany = Cache::remember("company_{$company_id}_users", 60, function () use ($company_id) {
                return User::where('company_id', $company_id)
                    ->with(['roles:id,name', 'detail:id,user_id,first_name,middle_name,last_name,profileImage'])
                    ->select('id', 'email', 'status')
                    ->get();
            });

            return response()->json([
                'data' => [
                    'usersInCompany' => $usersInCompany,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching the staff data.',
            ], 500);
        }
    }

    public function calendar(Request $request)
    {
        $commonData = $this->loadCommonData($request);
        $events = $commonData['company']->events;

        $data = array_merge($commonData, ['events' => $events]);

        return response()->json($data);
    }

}
