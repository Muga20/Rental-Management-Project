<?php

namespace Modules\Payment\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Company\Models\Company;

class SubscriptionController extends Controller
{
    public function companiesSubscribed(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);

            $companies = Company::whereHas('subscriptions')
                ->with('subscriptions.plan', 'subscriptions.stkrequest')
                ->latest()
                ->paginate(10);

            foreach ($companies as $company) {
                $subscription = $company->subscriptions->first();
                $plan = $subscription ? $subscription->plan : null;
                $stkrequest = $subscription ? $subscription->stkrequest : null; // Access the Stkrequest instance
                $carryForward = $stkrequest ? max($stkrequest->amount - ($plan ? $plan->price : 0), 0) : 0;

                $company->plan_name = $plan ? $plan->plan_name : '-';
                $company->price = $plan ? $plan->price : '-';
                $company->amount_paid = $stkrequest ? $stkrequest->amount : '-';
                $company->confirmationCode = $stkrequest ? $stkrequest->MpesaReceiptNumber : '-';
                $company->transactionDate = $stkrequest ? $stkrequest->TransactionDate : '-';
                $company->transactionStatus = $stkrequest ? $stkrequest->status : '-';

                $company->carry_forward = $carryForward;
            }

            return response()->json([
                'data' => [
                    'companies' => $companies,
                ],
            ]);

            
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching companies data',
            ], 500);
        }
    }

}
