<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Participant\SubmitQuestionnaireRequest;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use App\Services\ScoringService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubmissionController extends Controller
{
    public function __construct(private ScoringService $scoringService) {}

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

        $exists = Submission::where('participant_id', $request->participant_id)
            ->where('activity_id', $request->activity_id)
            ->where('test_type', $request->test_type)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Anda sudah pernah mengirim kuesioner ini.'], 422);
        }

        try {
            $submission = DB::transaction(function () use ($request) {
                $result = $this->scoringService->calculate($request->answers);
                $token = Str::random(64);

                $submission = Submission::create([
                    'activity_id' => $request->activity_id,
                    'participant_id' => $request->participant_id,
                    'result_token' => $token,
                    'test_type' => $request->test_type,
                    'language' => $request->language,
                    'digital_literacy_score' => $result['digital_literacy_score'],
                    'digital_literacy_max_score' => $result['digital_literacy_max_score'],
                    'digital_literacy_percentage' => $result['digital_literacy_percentage'],
                    'digital_literacy_category' => $result['digital_literacy_category'],
                    'data_security_score' => $result['data_security_score'],
                    'data_security_max_score' => $result['data_security_max_score'],
                    'data_security_percentage' => $result['data_security_percentage'],
                    'data_security_category' => $result['data_security_category'],
                    'submitted_at' => now(),
                ]);

                foreach ($result['details'] as $detail) {
                    $detail['submission_id'] = $submission->id;
                    SubmissionAnswer::create($detail);
                }

                return $submission;
            });
            
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
