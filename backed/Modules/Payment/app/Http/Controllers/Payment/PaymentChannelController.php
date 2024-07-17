<?php

namespace Modules\Payment\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Modules\Payment\Models\PaymentChannel;

class PaymentChannelController extends Controller
{
    public function paymentChannel()
    {
        try {
            $paymentChannels = PaymentChannel::with('paymentType')->get();

            return response()->json([
                'data' => [
                    'paymentChannels' => $paymentChannels,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function deactivatePaymentChannel($id)
    {
        try {
            $paymentChannel = PaymentChannel::findOrFail($id);

            $newStatus = $paymentChannel->status === 'active' ? 'inactive' : 'active';

            $paymentChannel->update([
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

    public function storePaymentChannel(Request $request)
    {
        try {
            $request->validate([
                'channel_name' => 'required|string|max:255',
                'channel_logo' => 'required|image',
                'payment_type_id' => 'required|exists:payment_types,id',
            ]);

            $image = $request->file('channel_logo');
            $uploadedImageUrl = Cloudinary::upload($image->getRealPath())->getSecurePath();

            $paymentChannel = new PaymentChannel();
            $paymentChannel->channel_name = $request->channel_name;
            $paymentChannel->slug = Str::slug($request->input('channel_name'), '-') . '-' . (PaymentChannel::count() + 1);
            $paymentChannel->status = 'active';
            $paymentChannel->channel_logo = $uploadedImageUrl;
            $paymentChannel->payment_type_id = $request->payment_type_id;

            $paymentChannel->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment Channel Created Successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function updatePaymentChannel(Request $request, $id)
    {
        try {
            $paymentChannel = PaymentChannel::findOrFail($id);

            $request->validate([
                'channel_name' => 'required|string|max:255',
                'channel_logo' => 'sometimes|nullable|image',
                'payment_type_id' => 'required|exists:payment_types,id',
            ]);

            if ($request->hasFile('channel_logo')) {
                $image = $request->file('channel_logo');
                $uploadedImageUrl = Cloudinary::upload($image->getRealPath())->getSecurePath();
                $paymentChannel->channel_logo = $uploadedImageUrl;
            }

            $paymentChannel->channel_name = $request->channel_name;
            $paymentChannel->payment_type_id = $request->payment_type_id;
            $paymentChannel->status = 'active';

            $paymentChannel->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment Channel updated successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update Payment Channel. Please try again.',
            ], 500);
        }
    }

    public function deleteThisPaymentChannel($id)
    {
        try {
            $paymentChannel = PaymentChannel::findOrFail($id);

            // You can add additional conditions to check if the channel can be deleted

            $paymentChannel->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payment Channel deleted Successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

}
