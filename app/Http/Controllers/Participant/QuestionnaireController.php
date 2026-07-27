<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuestionnaireVersion;
use App\Models\Submission;
use App\Services\QuestionnaireDraftService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuestionnaireController extends Controller
{
    public function __construct(private QuestionnaireDraftService $draftService)
    {
    }

    public function show(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $session = session('participant_session');
        if (!$session) {
            return redirect()->route('participant.landing');
        }

        $submission = Submission::with(['participant.school', 'participant.classroom', 'questionnaireVersion'])
            ->where('id', $session['submission_id'] ?? 0)
            ->where('participant_id', $session['id'] ?? 0)
            ->where('activity_id', $session['activity_id'] ?? 0)
            ->where('test_type', $session['test_type'] ?? '')
            ->first();

        if (! $submission) {
            session()->forget('participant_session');

            return redirect()->route('participant.landing');
        }

        if ($submission->status === 'completed') {
            session()->forget('participant_session');

            return redirect()->route('participant.result', ['token' => $submission->result_token]);
        }

        $version = $submission->questionnaireVersion ?: QuestionnaireVersion::active();

        if (! $submission->questionnaire_version_id && $version && ! $submission->answers()->exists()) {
            $submission->update(['questionnaire_version_id' => $version->id]);
            $submission->setRelation('questionnaireVersion', $version);
        }

        $orderedQuestions = Question::with([
            'answerOptions' => function($q) {
            $q->where('is_active', true)->orderBy('display_order');
            },
            'responseScale',
            'competencies',
        ])
        ->where('is_active', true)
        ->when($version, fn ($query) => $query->where('questionnaire_version_id', $version->id))
        ->orderBy('display_order')
        ->get();

        $initialStep = $orderedQuestions->search(fn (Question $question) => (int) $question->id === (int) $submission->current_question_id);
        $initialStep = $initialStep === false ? 0 : $initialStep;

        return Inertia::render('Participant/Questionnaire', [
            'questions' => $orderedQuestions->groupBy('module'),
            'participant_id' => $session['id'],
            'test_type' => $session['test_type'],
            'activity_id' => $session['activity_id'],
            'language' => $session['language'] ?? 'id',
            'submission_token' => $submission->result_token,
            'initial_answers' => $this->draftService->answerMap($submission),
            'initial_step' => $initialStep,
            'last_saved_at' => optional($submission->last_activity_at)->toIso8601String(),
            'instrument' => [
                'version_id' => $version?->id,
                'version_name' => $version?->name,
                'version_code' => $version?->code,
                'description' => $version?->description ?: 'Instrumen adaptasi berbasis Indeks Literasi Digital Indonesia 2022 dan dipetakan menggunakan UNESCO Digital Literacy Global Framework.',
                'source_reference' => $version?->source_reference,
            ],
            'participant' => [
                'code' => $submission->participant?->participant_code,
                'name' => $submission->participant?->full_name,
                'role' => $submission->participant?->role,
                'school' => $submission->participant?->school?->name,
                'classroom' => $submission->participant?->classroom?->name,
            ],
        ]);
    }
}
