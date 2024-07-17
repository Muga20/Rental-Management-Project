<?php

use Illuminate\Support\Facades\Route;
use Modules\Homes\Http\Controllers\HomesController;
use Modules\Homes\Http\Controllers\ManageHomeController;
use Modules\Homes\Http\Controllers\NewHomeController;
use Modules\Homes\Http\Controllers\ShowHomeController;
use Modules\Homes\Http\Controllers\UnitsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::middleware(['token'])->prefix('v1')->group(function () {
    Route::prefix('/home')->group(function () {
        Route::get('/', [ShowHomeController::class, 'showHomes']);

        Route::get('/units/{home}', [UnitsController::class, 'getHomeUnits']);
        Route::get('/home-profile/{unit}', [HomesController::class, 'HomeProfile']);
        Route::post('/create-new-home', [NewHomeController::class, 'createNewHome']);
        Route::post('/update-home/{home_id}', [ManageHomeController::class, 'editedHome']);

        // Routes for managing agents
        Route::post('/add-agent/{home_id}', [ManageHomeController::class, 'addNewAgent']);
        Route::delete('/remove-agent/{agent_id}', [ManageHomeController::class, 'removeAgent']);

        // Routes for managing caretakers
        Route::post('/add-caretaker/{home_id}', [ManageHomeController::class, 'addNewCareTaker']);
        Route::delete('/remove-caretaker/{careTakerId}', [ManageHomeController::class, 'removeCareTaker']);
    });
});
