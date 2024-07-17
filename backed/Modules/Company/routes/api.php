<?php

use Illuminate\Support\Facades\Route;
use Modules\Company\Http\Controllers\CompanyController;
use Modules\Company\Http\Controllers\NewCompanyController;

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
    Route::prefix('/company')->group(function () {
        Route::post('/create-company', [NewCompanyController::class, 'newCompany']);
        Route::get('/showAvailableCompanies', [CompanyController::class, 'showAvailableCompanies']);

        Route::get('/showAvailableCompanies/company-owner', [CompanyController::class, 'companyOwner'])->name('companyOwner');
        Route::delete('/{companyId}', [CompanyController::class, 'destroy'])->name('company.destroy');
        Route::put('/{companyId}/status', [CompanyController::class, 'deactivate'])->name('company.deactivate');
    });

});


