<?php

// app/Helpers/ApiResponse.php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function response($success, $message, $statusCode)
    {
        return response()->json([
            'success' => $success,
            'message' => $message
        ], $statusCode);
    }

    public static function error($message, $statusCode)
    {
        return self::response(false, $message, $statusCode);
    }

    public static function success($message, $statusCode)
    {
        return self::response(true, $message, $statusCode);
    }
}
