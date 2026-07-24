<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Services\QuestionnaireDraftService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class QuestionnaireDraftController extends Controller
{
    public function __construct(private QuestionnaireDraftService $draftService)
    {
    }

    public function resume(Submission $submission): JsonResponse
    {
        $this->ensureSessionOwns($submission);

        return response()->json([
            'answers' => $this->draftService->answerMap($submission),
            'progress' => $this->draftService->progress($submission),
        ]);
    }

    public function answer(Request $request, Submission $submission): JsonResponse
    {
        $this->ensureSessionOwns($submission);

        $data = $request->validate([
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'answer_option_id' => ['required', 'integer', 'exists:answer_options,id'],
            'current_step' => ['nullable', 'string', 'max:50'],
        ]);

        $this->draftService->saveAnswer(
            $submission,
            (int) $data['question_id'],
            (int) $data['answer_option_id'],
            $data['current_step'] ?? null,
        );

        return response()->json([
            'success' => true,
            'saved_at' => now()->toIso8601String(),
            'progress' => $this->draftService->progress($submission->fresh()),
        ]);
    }

    public function progress(Request $request, Submission $submission): JsonResponse
    {
        $this->ensureSessionOwns($submission);

        $data = $request->validate([
            'current_step' => ['nullable', 'string', 'max:50'],
            'current_question_id' => ['nullable', 'integer', 'exists:questions,id'],
        ]);

        $this->draftService->updateProgress(
            $submission,
            $data['current_step'] ?? null,
            isset($data['current_question_id']) ? (int) $data['current_question_id'] : null,
        );

        return response()->json([
            'success' => true,
            'saved_at' => now()->toIso8601String(),
            'progress' => $this->draftService->progress($submission->fresh()),
        ]);
    }

    public function complete(Request $request, Submission $submission): JsonResponse
    {
        $this->ensureSessionOwns($submission);

        $data = $request->validate([
            'answers' => ['nullable', 'array'],
            'answers.*' => ['required', 'integer', 'exists:answer_options,id'],
            'language' => ['nullable', 'string', 'in:id,en'],
        ]);

        if (! empty($data['language']) && $submission->status !== 'completed') {
            $submission->update(['language' => $data['language']]);
        }

        $submission = $this->draftService->complete($submission, $data['answers'] ?? []);
        session()->forget('participant_session');

        return response()->json([
            'success' => true,
            'token' => $submission->result_token,
            'redirect' => route('participant.result', ['token' => $submission->result_token]),
        ]);
    }

    private function ensureSessionOwns(Submission $submission): void
    {
        $session = session('participant_session');

        if (
            ! $session
            || (int) ($session['submission_id'] ?? 0) !== (int) $submission->id
            || (int) ($session['id'] ?? 0) !== (int) $submission->participant_id
            || (int) ($session['activity_id'] ?? 0) !== (int) $submission->activity_id
            || ($session['test_type'] ?? null) !== $submission->test_type
        ) {
            throw ValidationException::withMessages([
                'session' => 'Sesi pengisian tidak valid. Silakan mulai ulang dari halaman kode peserta.',
            ]);
        }
    }
}
