<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ParticipantController;
use App\Http\Controllers\Admin\ResultController;
use App\Http\Controllers\Admin\ComparisonController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\GuideController;
use App\Http\Controllers\Admin\ScoringSettingController;

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
        Route::get('/panduan', [GuideController::class, 'index'])->name('guide.index');
        
        // Master Data & Activities
        Route::resource('activities', \App\Http\Controllers\Admin\ActivityController::class)->except(['show']);
        Route::post('schools/{school}/classes', [ClassroomController::class, 'store'])->name('schools.classes.store');
        Route::put('schools/{school}/classes/{classroom}', [ClassroomController::class, 'update'])->name('schools.classes.update');
        Route::delete('schools/{school}/classes/{classroom}', [ClassroomController::class, 'destroy'])->name('schools.classes.destroy');
        Route::resource('schools', \App\Http\Controllers\Admin\SchoolController::class)->except(['show']);
        Route::post('participants/import', [ParticipantController::class, 'import'])->name('participants.import');
        Route::resource('participants', ParticipantController::class)->except(['show']);
        Route::get('questions/print', [\App\Http\Controllers\Admin\QuestionController::class, 'printable'])->name('questions.print');
        Route::resource('questions', \App\Http\Controllers\Admin\QuestionController::class)->except(['show']);
        Route::get('scoring', [ScoringSettingController::class, 'index'])->name('scoring.index');
        Route::put('scoring', [ScoringSettingController::class, 'update'])->name('scoring.update');
        Route::get('export', [ExportController::class, 'index'])->name('export.index');
        Route::get('export/participants', [ExportController::class, 'participants'])->name('export.participants');
        Route::get('results/export', [ResultController::class, 'export'])->name('results.export');
        Route::get('results', [ResultController::class, 'index'])->name('results.index');
        Route::get('comparisons/export', [ComparisonController::class, 'export'])->name('comparisons.export');
        Route::get('comparisons', [ComparisonController::class, 'index'])->name('comparisons.index');
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
        
    });
});
