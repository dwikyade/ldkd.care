<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Participant\LandingController;
use App\Http\Controllers\Participant\ParticipantCodeController;
use App\Http\Controllers\Participant\ParticipantController;
use App\Http\Controllers\Participant\ParticipantRegistrationController;
use App\Http\Controllers\Participant\QuestionnaireController;
use App\Http\Controllers\Participant\QuestionnaireDraftController;
use App\Http\Controllers\Participant\SubmissionController;
use App\Http\Controllers\Participant\ResultController;
use App\Http\Controllers\Participant\TestEligibilityController;

// Participant Routes (No login required)
Route::get('/', [LandingController::class, 'index'])->name('participant.landing');
Route::get('/select-mode', [LandingController::class, 'selectMode'])->name('participant.select-mode');
Route::get('/select-role', [LandingController::class, 'selectRole'])->name('participant.select-role');

Route::get('/identify', [ParticipantController::class, 'identify'])->name('participant.identify');
Route::post('/verify', [ParticipantController::class, 'verify'])->name('participant.verify');
Route::middleware('throttle:30,1')->post('/participant-code/check', [ParticipantCodeController::class, 'check'])->name('participant.code.check');
Route::middleware('throttle:20,1')->post('/participant-code/generate', [ParticipantCodeController::class, 'generate'])->name('participant.code.generate');
Route::middleware('throttle:20,1')->post('/participants/register', [ParticipantRegistrationController::class, 'store'])->name('participant.register');
Route::middleware('throttle:30,1')->post('/pre-test/resume', [TestEligibilityController::class, 'preTestResume'])->name('participant.pretest.resume');
Route::middleware('throttle:30,1')->post('/post-test/eligibility', [TestEligibilityController::class, 'postTestEligibility'])->name('participant.posttest.eligibility');
Route::middleware('throttle:20,1')->post('/post-test/start', [TestEligibilityController::class, 'startPostTest'])->name('participant.posttest.start');

Route::get('/questionnaire', [QuestionnaireController::class, 'show'])->name('participant.questionnaire');
Route::post('/submit', [SubmissionController::class, 'submit'])->name('participant.submit');
Route::get('/questionnaire/{submission:result_token}/resume', [QuestionnaireDraftController::class, 'resume'])->name('participant.questionnaire.resume');
Route::post('/questionnaire/{submission:result_token}/answers', [QuestionnaireDraftController::class, 'answer'])->name('participant.questionnaire.answers');
Route::patch('/questionnaire/{submission:result_token}/progress', [QuestionnaireDraftController::class, 'progress'])->name('participant.questionnaire.progress');
Route::post('/questionnaire/{submission:result_token}/complete', [QuestionnaireDraftController::class, 'complete'])->name('participant.questionnaire.complete');

Route::get('/result/{token}', [ResultController::class, 'show'])->name('participant.result');

// Includes admin routes later
require __DIR__.'/admin.php';
