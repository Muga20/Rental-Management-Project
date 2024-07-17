<?php

use Illuminate\Support\Facades\Route;
use Modules\User\Http\Controllers\Auth\AuthenticateController;
use Modules\User\Http\Controllers\Auth\AuthNewUserController;
use Modules\User\Http\Controllers\Auth\DeactivateUserController;
use Modules\User\Http\Controllers\Auth\JWTRefreshController;
use Modules\User\Http\Controllers\Auth\ResetPasswordController;
use Modules\User\Http\Controllers\RolesController;
use Modules\User\Http\Controllers\UserController;
use Modules\User\Http\Controllers\User\AccountSettingsController;
use Modules\User\Http\Controllers\User\DashboardController;
use Modules\User\Http\Controllers\User\NewUserController;
use Modules\User\Http\Controllers\User\UsersByRoleAndSearchController;

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

    Route::prefix('/member')->group(function () {
        Route::apiResource('user', UserController::class)->names('user');
        Route::post('/create-member', [NewUserController::class, 'storeNewUser']);
        Route::post('/update-profile-image', [UserController::class, 'updateProfileImage']);
        Route::post('/remove-profile-image', [UserController::class, 'removeImage']);

        Route::get('/userSettings', [UserController::class, 'userSettings'])->name('userSettings');
        Route::get('/userSecurity', [UserController::class, 'userSecurity'])->name('userSecurity');
        Route::get('/userDeactivate', [UserController::class, 'userDeactivate'])->name('userDeactivate');
        Route::post('/two-fa-setup', [AccountSettingsController::class, 'twoFaSetup'])->name('twoFaSetup');
        Route::get('/get-authenticated-cred', [UserController::class, 'getAuthenticatedUser']);
        Route::get('/staff', [DashboardController::class, 'stuff'])->name('staff');
        Route::post('/update-this-user-profile', [UserController::class, 'updateUser']);

        Route::post('/set-auth-type', [AccountSettingsController::class, 'setAuthType']);
        Route::post('/deactivate-account', [DeactivateUserController::class, 'deactivateMyAccount']);

    });

    Route::prefix('/roles')->group(function () {
        Route::get('/', [RolesController::class, 'index']);
        Route::get('/{role}', [UsersByRoleAndSearchController::class, 'getUsersByRoleAndSearch']);
        Route::get('/create', [RolesController::class, 'create'])->name('role.create');
        Route::get('/all-users', [UserController::class, 'allUsers'])->name('allUsers');
        Route::post('/create-role', [RolesController::class, 'createRole'])->name('createRole');
        Route::get('/edit-role/{role}', [RolesController::class, 'editRole'])->name('editRole');
        Route::put('/update-role/{role}', [RolesController::class, 'updateRole']);
        Route::put('/toggleRoles/{role}', [RolesController::class, 'deactivateOrActivateRole']);
        Route::put('/deactivate_user/{deactivate}', [RolesController::class, 'deactivateUser']);
        Route::post('/assign_role_to_user/{id}', [RolesController::class, 'assignRoleToUser']);
        // Route for deleting a role
        Route::delete('/delete_role_action/{user}/{role}', [RolesController::class, 'deleteRoleFromUser']);
        Route::delete('/delete_role/{role}', [RolesController::class, 'deleteRole']);
    });

    //Protected Authentication and AuthRoutes
    Route::prefix('/auth')->group(function () {
        Route::post('/reset-password', [AccountSettingsController::class, 'updateSecurity'])->name('updateSecurity');
        Route::post('/reset-email', [AccountSettingsController::class, 'updateEmailSecurity'])->name('updateEmailSecurity');
    });

});

Route::prefix('v1')->group(function () {
    //Authentication and AuthRoutes
    Route::get('/login', [AuthenticateController::class, 'login'])->middleware('redirect.auth')->name('login');
    Route::post('/authenticate', [AuthenticateController::class, 'authenticate'])->name('authenticate');
    Route::post('/login_user', [AuthenticateController::class, 'logInUser'])->name('logInUser');
    Route::post('/receive-OTP', [AuthenticateController::class, 'receiveOTP'])->name('receiveOTP');
    Route::post('/authenticate-OTP', [AuthenticateController::class, 'authenticateOTP'])->name('authenticateOTP');
    Route::post('/activate', [DeactivateUserController::class, 'sendToken'])->name('sendToken');
    Route::get('/verify-code', [AuthenticateController::class, 'verifyTwoFa'])->name('verifyTwoFa');
    Route::post('/verify-code', [AuthenticateController::class, 'verifyTwoFaCode'])->name('verifyTwoFaCode');
    Route::post('/refresh-token', [JWTRefreshController::class, 'refreshToken']);
    Route::post('/check-login-type', [AuthenticateController::class, 'checkLoginType'])->name('checkLoginType');
    Route::post('/authenticate-user', [AuthenticateController::class, 'logInUser'])->name('logInUser');
    Route::post('/forgot-password', [ResetPasswordController::class, 'sendResetPasswordEmail'])->name('sendResetPasswordEmail');
    Route::get('/passwordReset/{token}', [ResetPasswordController::class, 'passwordReset'])->middleware('redirect.auth')->name('passwordReset');
    Route::post('/new-password/{token}', [ResetPasswordController::class, 'newPassword']);
    Route::post('/auth-new-user/{authLink}', [AuthNewUserController::class, 'ConfirmAuthNewUser']);
    Route::post('/logout', [AuthenticateController::class, 'logout'])->name('logout');

});
