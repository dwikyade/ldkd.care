<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;

Route::prefix('admin')->name('admin.')->group(function () {
    
    // Guest Admin Routes
    Route::middleware(['guest'])->group(function () {
        Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    });

    // Protected Admin Routes
    Route::middleware(['auth'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Master Data & Activities
        Route::resource('activities', \App\Http\Controllers\Admin\ActivityController::class)->except(['show']);
        Route::resource('schools', \App\Http\Controllers\Admin\SchoolController::class)->except(['show']);
        Route::resource('questions', \App\Http\Controllers\Admin\QuestionController::class)->except(['show']);
        
    });
});
