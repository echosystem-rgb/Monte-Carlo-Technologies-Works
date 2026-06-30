<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsSuperAdmin;

// Products — public reads (no login needed to browse)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Auth (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Everything below requires a valid Sanctum token
Route::middleware('auth:sanctum')->group(function () {

    // Products — writes (create/edit/delete require login)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Auth (logged in required)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);

    // Super Admin & Admin — handled inside the controller method itself
    Route::get('/admin/users', [AdminController::class, 'index']);

    // Admin only
    Route::middleware(IsAdmin::class)->group(function () {
        Route::put('/admin/resign', [AdminController::class, 'resignAdmin']);
    });

    // Super Admin only
    Route::middleware(IsSuperAdmin::class)->group(function () {
        Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);
        Route::put('/admin/users/{id}/make-admin', [AdminController::class, 'makeAdmin']);
        Route::put('/admin/users/{id}/remove-admin', [AdminController::class, 'removeAdmin']);
        Route::put('/admin/transfer-super-admin/{id}', [AdminController::class, 'transferSuperAdmin']);
        Route::put('/admin/resign-super-admin', [AdminController::class, 'resignSuperAdmin']);
    });
});