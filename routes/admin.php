<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ParticipantController;
use App\Http\Controllers\Admin\ResultController;
use App\Http\Controllers\Admin\ComparisonController;

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
        Route::post('participants/import', [ParticipantController::class, 'import'])->name('participants.import');
        Route::resource('participants', ParticipantController::class)->except(['show']);
        Route::resource('questions', \App\Http\Controllers\Admin\QuestionController::class)->except(['show']);
        Route::get('results/export', [ResultController::class, 'export'])->name('results.export');
        Route::get('results', [ResultController::class, 'index'])->name('results.index');
        Route::get('comparisons/export', [ComparisonController::class, 'export'])->name('comparisons.export');
        Route::get('comparisons', [ComparisonController::class, 'index'])->name('comparisons.index');
        
    });
});
