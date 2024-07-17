<?php

use Illuminate\Support\Facades\Route;
use Modules\Payment\Http\Controllers\Payment\PaymentChannelController;
use Modules\Payment\Http\Controllers\Payment\PaymentModeController;
use Modules\Payment\Http\Controllers\PaymentController;
use Modules\Payment\Http\Controllers\Payment\HomePaymentController;
use Modules\Payment\Http\Controllers\Plans\PlansController;
use Modules\Payment\Http\Controllers\Subscription\SubscriptionController;

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

    Route::prefix('/payment')->group(function () {
        Route::get('/get-payment-mode-types', [PaymentModeController::class, 'paymentModeTypes']);
        Route::put('/deactivate_payment/{deactivate}', [PaymentModeController::class, 'deactivatePayment']);
        Route::post('/create-Payment', [PaymentModeController::class, 'storePayment']);
        Route::put('/Payment-setting/update-type/{Payment}', [PaymentModeController::class, 'updatePayment']);
        Route::delete('/deleteThisPayment/{Payment}', [PaymentModeController::class, 'deleteThisPayment']);
        Route::get('/get-home-payment-type/{homeId}', [HomePaymentController::class, 'getHomePaymentType']);
        Route::post('/store-home-payment-info/{home_id}' , [ HomePaymentController::class, 'storeHomePaymentInfo']);
        Route::put('/update-home-payment-info/{Payment}', [HomePaymentController::class, 'updateHomePaymentInfo']);
        Route::delete('/delete-home-payment-info/{Payment}', [HomePaymentController::class, 'deleteHomePaymentInfo']);


        // Routes for PaymentChannelController
        Route::get('/get-payment-channels', [PaymentChannelController::class, 'paymentChannel']);
        Route::put('/deactivate-payment-channel/{id}', [PaymentChannelController::class, 'deactivatePaymentChannel']);
        Route::post('/store-payment-channel', [PaymentChannelController::class, 'storePaymentChannel']);
        Route::put('/update-payment-channel/{id}', [PaymentChannelController::class, 'updatePaymentChannel']);
        Route::delete('/delete-payment-channel/{id}', [PaymentChannelController::class, 'deleteThisPaymentChannel']);
    });

    Route::prefix('plans')->group(function () {
        Route::get('/', [PlansController::class, 'index']);
        Route::post('/create_plan', [PlansController::class, 'CreatePlan']);
        Route::get('/edit-plan/{plan}', [PlansController::class, 'editPlan']);
        Route::put('/update-plan/{plan}', [PlansController::class, 'updatePlan'])->name('updatePlan');
        Route::delete('/delete-plan/{plan}', [PlansController::class, 'deletePlan'])->name('deletePlan');
        Route::put('/toggle-plan-status/{plan}', [PlansController::class, 'togglePlanStatus']);
    });

    Route::prefix('subscription')->group(function () {
        Route::get('/companies-subscribed', [SubscriptionController::class, 'companiesSubscribed']);
    });

});
