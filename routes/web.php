<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Participant\LandingController;
use App\Http\Controllers\Participant\ParticipantController;
use App\Http\Controllers\Participant\QuestionnaireController;
use App\Http\Controllers\Participant\SubmissionController;
use App\Http\Controllers\Participant\ResultController;

// Participant Routes (No login required)
Route::get('/', [LandingController::class, 'index'])->name('participant.landing');
Route::get('/select-mode', [LandingController::class, 'selectMode'])->name('participant.select-mode');
Route::get('/select-role', [LandingController::class, 'selectRole'])->name('participant.select-role');

Route::get('/identify', [ParticipantController::class, 'identify'])->name('participant.identify');
Route::post('/verify', [ParticipantController::class, 'verify'])->name('participant.verify');

Route::get('/questionnaire', [QuestionnaireController::class, 'show'])->name('participant.questionnaire');
Route::post('/submit', [SubmissionController::class, 'submit'])->name('participant.submit');

Route::get('/result/{token}', [ResultController::class, 'show'])->name('participant.result');

// Includes admin routes later
require __DIR__.'/admin.php';
