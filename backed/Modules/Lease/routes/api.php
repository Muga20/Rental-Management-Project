<?php

use Illuminate\Support\Facades\Route;
use Modules\Lease\Http\Controllers\Home\HomeLeaseController;

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
    Route::prefix('/lease')->group(function () {
        Route::post("/lease-a-home-to-tenant/{unit_id}", [HomeLeaseController::class, "leaseAHomeToTenant"]);
        Route::get("/get-who-has-leased-unit-for-test/{unit_id}", [HomeLeaseController::class, "getWhoHasleasedAUnitForTest"]);
        Route::get("/get-who-has-leased-unit-for-production/{tenant_id}", [HomeLeaseController::class, "getWhoHasleasedAUnitForProduction"]);

        Route::put("/update/{id}", [HomeLeaseController::class, "update"]);
        Route::delete("/terminate-lease/{id}", [HomeLeaseController::class, "terminateLease"]);
    });
});
