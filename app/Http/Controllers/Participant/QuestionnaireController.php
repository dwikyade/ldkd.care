<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuestionnaireController extends Controller
{
    public function show(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $session = session('participant_session');
        if (!$session) {
            return redirect()->route('participant.landing');
        }

        $questions = Question::with(['answerOptions' => function($q) {
            $q->where('is_active', true)->orderBy('display_order');
        }])
        ->where('is_active', true)
        ->orderBy('display_order')
        ->get()
        ->groupBy('module');

        return Inertia::render('Participant/Questionnaire', [
            'questions' => $questions,
            'participant_id' => $session['id'],
            'test_type' => $session['test_type'],
            'activity_id' => $session['activity_id'],
        ]);
    }
}
