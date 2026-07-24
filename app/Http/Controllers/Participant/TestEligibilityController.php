<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use App\Services\ParticipantCodeService;
use App\Services\PostTestEligibilityService;
use App\Services\PreTestEligibilityService;
use App\Services\QuestionnaireDraftService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TestEligibilityController extends Controller
{
    public function __construct(
        private ParticipantCodeService $codeService,
        private PreTestEligibilityService $preTestEligibility,
        private PostTestEligibilityService $postTestEligibility,
        private QuestionnaireDraftService $draftService,
    ) {
    }

    public function preTestResume(Request $request): JsonResponse
    {
        $data = $this->validatedLookup($request);
        $result = $this->preTestEligibility->check((int) $data['activity_id'], $data['suffix'], $data['role']);

        if ($result['status'] === 'PRETEST_DRAFT') {
            $this->storeSessionFromToken((int) $data['activity_id'], $data['suffix'], $data['role'], 'pre_test', $data['language'] ?? 'id');
            $result['redirect'] = route('participant.questionnaire');
        }

        return response()->json($result);
    }

    public function postTestEligibility(Request $request): JsonResponse
    {
        $data = $this->validatedLookup($request);
        $result = $this->postTestEligibility->check((int) $data['activity_id'], $data['suffix'], $data['role']);

        if (in_array($result['status'], ['PRETEST_INCOMPLETE', 'POSTTEST_INCOMPLETE'], true)) {
            $testType = $result['status'] === 'PRETEST_INCOMPLETE' ? 'pre_test' : 'post_test';
            $this->storeSessionFromToken((int) $data['activity_id'], $data['suffix'], $data['role'], $testType, $data['language'] ?? 'id');
            $result['redirect'] = route('participant.questionnaire');
        }

        return response()->json($result);
    }

    public function startPostTest(Request $request): JsonResponse
    {
        $data = $this->validatedLookup($request);
        $result = $this->postTestEligibility->check((int) $data['activity_id'], $data['suffix'], $data['role']);

        if ($result['status'] !== 'POSTTEST_AVAILABLE') {
            throw ValidationException::withMessages([
                'suffix' => $result['message'] ?? 'Post-Test belum dapat dimulai.',
            ]);
        }

        $participant = $this->participant((int) $data['activity_id'], $data['suffix'], $data['role']);
        $submission = $this->draftService->createDraft($participant, 'post_test', $data['language'] ?? 'id');

        $this->storeParticipantSession($participant->id, $participant->activity_id, 'post_test', $submission->id, $submission->result_token, $data['language'] ?? 'id');

        return response()->json([
            'success' => true,
            'participant' => $this->postTestEligibility->participantSummary($participant),
            'submission_token' => $submission->result_token,
            'redirect' => route('participant.questionnaire'),
        ]);
    }

    private function validatedLookup(Request $request): array
    {
        $data = $request->validate([
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
            'suffix' => ['required', 'string', 'max:10'],
            'role' => ['required', Rule::in(['student', 'teacher'])],
            'language' => ['nullable', Rule::in(['id', 'en'])],
        ]);

        $suffix = $this->codeService->extractSuffix($data['suffix']);
        if (! $this->codeService->isValidSuffix($suffix)) {
            throw ValidationException::withMessages([
                'suffix' => 'Kode harus terdiri dari 4-5 huruf atau angka.',
            ]);
        }

        $data['suffix'] = $suffix;

        return $data;
    }

    private function storeSessionFromToken(int $activityId, string $suffix, string $role, string $testType, string $language): void
    {
        $participant = $this->participant($activityId, $suffix, $role);
        $submission = $participant->submissions()->where('test_type', $testType)->firstOrFail();

        $this->storeParticipantSession($participant->id, $activityId, $testType, $submission->id, $submission->result_token, $language);
    }

    private function participant(int $activityId, string $suffix, string $role): Participant
    {
        return Participant::with(['school', 'classroom'])
            ->where('activity_id', $activityId)
            ->whereRaw('UPPER(participant_code) = ?', [$this->codeService->makeCode($suffix)])
            ->where('role', $role)
            ->where('is_active', true)
            ->whereNull('merged_into_id')
            ->firstOrFail();
    }

    private function storeParticipantSession(
        int $participantId,
        int $activityId,
        string $testType,
        int $submissionId,
        string $submissionToken,
        string $language,
    ): void {
        session([
            'participant_session' => [
                'id' => $participantId,
                'test_type' => $testType,
                'activity_id' => $activityId,
                'language' => $language,
                'submission_id' => $submissionId,
                'submission_token' => $submissionToken,
            ],
        ]);
    }
}
