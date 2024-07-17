<?php

namespace App\Traits;

use App\Models\Plans;
use App\Models\Subscription;
use App\Models\Home;
use Illuminate\Support\Facades\Redirect;


trait SubscriptionCheckTrait
{
    public function checkSubscription($company)
    {
        $subscription = Subscription::where('company_id', $company->id)->first();

        if (!$subscription) {
            return Redirect::back()->with([
                'success' => false,
                'message', 'The company has not subscribed to any plan.'],403);
        }

        $plan = Plans::find($subscription->plan_id);

        if (!$plan || !$plan->number_of_homes) {

            return Redirect::back()->with([
                'success' => false,
                'message', 'The subscription plan is not properly configured.'] , 403);
        }

        $numberOfHomes = Home::where('company_id', $company->id)->count();

        if ($numberOfHomes >= $plan->number_of_homes) {

            return response()->json([
                'success' => false,
                'message' => 'The company has reached the limit of allowed homes according to their plan.'], 403);

        }

        return null;
    }

}
