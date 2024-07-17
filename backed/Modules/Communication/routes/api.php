<?php

use Illuminate\Support\Facades\Route;
use Modules\Communication\Http\Controllers\NotificationController;

/*
 *--------------------------------------------------------------------------
 * API Routes
 *--------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceProvider within a group which
 * is assigned the "api" middleware group. Enjoy building your API!
 *
 */

Route::middleware(['token'])->prefix('v1')->group(function () {

    Route::prefix('communication')->group(function () {
        Route::get('/notifications', [NotificationController::class, 'getAllNotifications']);
        Route::delete('/delete_notification/{id}', [NotificationController::class, 'deleteNotification']);

    });
});
