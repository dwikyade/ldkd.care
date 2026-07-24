<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Participant\SubmitQuestionnaireRequest;
use App\Models\Submission;
use App\Services\QuestionnaireDraftService;

class SubmissionController extends Controller
{
    public function __construct(private QuestionnaireDraftService $draftService) {}

    public function submit(SubmitQuestionnaireRequest $request)
    {
        $session = session('participant_session');
        if (
            ! $session
            || (int) $session['id'] !== (int) $request->participant_id
            || (int) $session['activity_id'] !== (int) $request->activity_id
            || $session['test_type'] !== $request->test_type
        ) {
            return response()->json(['message' => 'Sesi tidak valid'], 403);
        }

        $submission = Submission::where('id', $session['submission_id'] ?? 0)
            ->where('participant_id', $request->participant_id)
            ->where('activity_id', $request->activity_id)
            ->where('test_type', $request->test_type)
            ->first();

        if (! $submission) {
            return response()->json(['message' => 'Draft pengisian tidak ditemukan. Silakan mulai ulang dari halaman kode peserta.'], 422);
        }

        if ($submission->status === 'completed') {
            return response()->json(['message' => 'Anda sudah pernah mengirim kuesioner ini.'], 422);
        }

        try {
            if ($submission->status !== 'completed') {
                $submission->update(['language' => $request->language]);
            }

            $submission = $this->draftService->complete($submission, $request->answers);
            session()->forget('participant_session');

            return response()->json([
                'success' => true,
                'token' => $submission->result_token,
                'redirect' => route('participant.result', ['token' => $submission->result_token])
            ]);

        } catch (\Throwable $e) {
            return response()->json(['message' => 'Terjadi kesalahan server: ' . $e->getMessage()], 500);
        }
    }
}
