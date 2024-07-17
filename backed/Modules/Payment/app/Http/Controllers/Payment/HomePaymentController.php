<?php

namespace Modules\Payment\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Homes\Models\Home;
use Modules\Payment\Models\HomePaymentTypes;

class HomePaymentController extends Controller
{
    public function getHomePaymentType($homeId)
    {
        try {
            $paymentTypes = HomePaymentTypes::with('paymentChannel')
                ->where('home_id', $homeId)
                ->get();

            return response()->json([
                'data' => [
                    'paymentTypes' => $paymentTypes,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payment types: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function storeHomePaymentInfo(Request $request, $homeId)
    {
        try {
            $home = Home::where('id', $homeId)->firstOrFail();

            $request->validate([
                'account_number' => 'required|string',
                'account_payBill' => 'nullable|string',
                'payment_channels_id' => 'required|exists:payment_channels,id',
            ]);

            // Check for duplicate payment channel with the same account number
            $existingPaymentAccount = HomePaymentTypes::where('home_id', $home->id)
                ->where('payment_channels_id', $request->input('payment_channels_id'))
                ->where('account_number', $request->input('account_number'))
                ->first();

            if ($existingPaymentAccount) {
                return response()->json([
                    'success' => false,
                    'message' => 'This payment channel with the same account number already exists for this home.',
                ], 400);
            }

            $paymentTypesCount = HomePaymentTypes::where('home_id', $home->id)->count();
            if ($paymentTypesCount >= 8) {
                return response()->json([
                    'success' => false,
                    'message' => 'A home can only have up to three Payment types.',
                ], 400);
            }

            $paymentAccount = new HomePaymentTypes();
            $paymentAccount->account_payBill = $request->input('account_payBill');
            $paymentAccount->account_number = $request->input('account_number');
            $paymentAccount->payment_channels_id = $request->input('payment_channels_id');
            $paymentAccount->status = 'active';
            $paymentAccount->image_url = 'active';
            $paymentAccount->home_id = $home->id;

            $paymentAccount->save();

            return response()->json([
                'success' => true,
                'message' => 'Home payment information saved successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update home payment details: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateHomePaymentInfo(Request $request, $payment)
    {
        try {
            $paymentData = HomePaymentTypes::findOrFail($payment);

            $request->validate([
                'account_number' => 'required|string',
                'account_payBill' => 'nullable|string',
                'payment_channels_id' => 'required|exists:payment_channels,id',
            ]);

            // Update only the fields that are provided in the request
            $paymentData->fill($request->only(['account_payBill', 'account_number', 'payment_channels_id']));

            // Save the updated payment data
            $paymentData->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment details updated successfully',
                'paymentAccount' => $paymentData,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment details: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function deleteHomePaymentInfo($payment)
    {
        try {
            $paymentData = HomePaymentTypes::findOrFail($payment);

            $paymentData->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payment details deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payment details: ' . $e->getMessage(),
            ], 500);
        }
    }
}
