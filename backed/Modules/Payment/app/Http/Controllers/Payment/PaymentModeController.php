<?php

namespace Modules\Payment\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Payment\Models\PaymentType;

class PaymentModeController extends Controller
{
    public function paymentModeTypes()
    {
        try {
            $payments = PaymentType::all();
            return response()->json([
                'data' => [
                    'payments' => $payments,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function deactivatePayment($deactivate = null)
    {
        try {
            $payment = PaymentType::find($deactivate);

            if (!$payment) {
                return response()->json([
                    'error' => 'Payment type not found.',
                ]);
            }

            $newStatus = $payment->status === 'active' ? 'inactive' : 'active';

            $payment->update([
                'status' => $newStatus,
            ]);

            $successMessage = $newStatus === 'inactive' ? 'Payment type deactivated successfully.' : 'Payment type activated successfully.';

            return response()->json([
                'success' => true,
                'message' => $successMessage,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function storePayment(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $paymentType = new PaymentType();
            $paymentType->name = $request->name;
            $paymentType->status = 'active';
            $paymentType->slug = Str::slug($request->input('name'), '-') . '-' . (PaymentType::count() + 1);

            $paymentType->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment Created Successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function updatePayment(Request $request, $dummy, $payment)
    {
        try {
            $paymentType = PaymentType::where('slug', $payment)->firstOrFail();

            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $paymentType->name = $request->name;
            $paymentType->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment type updated successfully.',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update Payment type. Please try again.',
            ], 500);
        }
    }

    public function deleteThisPayment($payment)
    {
        try {
            $paymentType = PaymentType::findOrFail($payment);

            if ($paymentType->status === 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment type is active and cannot be deleted.',
                ], 400);
            }

            $paymentType->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payment deleted Successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

}
