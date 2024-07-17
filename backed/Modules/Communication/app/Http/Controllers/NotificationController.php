<?php

namespace Modules\Communication\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Communication\Jobs\DeleteNotificationJob;
use Illuminate\Support\Facades\Queue;
use Modules\Communication\Models\Channel;
use Modules\Communication\Models\UserChannels;
use Modules\Communication\Models\Notification;

class NotificationController extends Controller
{
    /**
     * Get all notifications.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllNotifications(Request $request)
    {
        try {
            $data = $this->loadCommonData($request);
            $user = $data['user'];
            $company = $data['company'];

            // Fetch notifications related to the user's channels ordered by creation date
            $notifications = Notification::select('notifications.*')
                ->join('user_channels', 'notifications.channel_id', '=', 'user_channels.channel_id')
                ->where('user_channels.user_id', $user->id)
                ->where('user_channels.company_id', $company->id)
                ->orderByDesc('notifications.created_at')
                ->get();

            return response()->json(['notifications' => $notifications], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve notifications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a notification.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteNotification($id)
    {
        try {
            // Dispatch the job to delete the notification
            Queue::push(new DeleteNotificationJob($id));

            return response()->json([
                'success' => true,
                'message' => 'Notification delete request queued successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to queue notification delete request: ' . $e->getMessage()], 500);
        }
    }


}
