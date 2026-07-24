<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Services\ParticipantCodeService;
use App\Services\ParticipantRegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ParticipantRegistrationController extends Controller
{
    public function __construct(
        private ParticipantRegistrationService $registrationService,
        private ParticipantCodeService $codeService,
    ) {
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
            'suffix' => ['required', 'string', 'max:10'],
            'role' => ['required', Rule::in(['student', 'teacher'])],
            'language' => ['nullable', Rule::in(['id', 'en'])],
            'full_name' => ['required', 'string', 'max:150'],
            'school_id' => ['nullable', 'integer', 'exists:schools,id'],
            'school_name' => ['required_without:school_id', 'nullable', 'string', 'max:150'],
            'class_id' => ['nullable', 'integer', 'exists:classes,id'],
            'class_name' => ['nullable', 'string', 'max:80'],
            'gender' => ['nullable', Rule::in(['male', 'female'])],
            'position' => ['nullable', 'string', 'max:100'],
        ]);

        $suffix = $this->codeService->extractSuffix($data['suffix']);
        if (! $this->codeService->isValidSuffix($suffix)) {
            throw ValidationException::withMessages([
                'suffix' => 'Kode harus terdiri dari 4-5 huruf atau angka.',
            ]);
        }

        if (! $this->codeService->isAvailable((int) $data['activity_id'], $suffix)) {
            throw ValidationException::withMessages([
                'suffix' => 'Kode sudah digunakan. Pilih kode lain.',
            ]);
        }

        $data['suffix'] = $suffix;
        $result = $this->registrationService->registerPreTest($data);
        $participant = $result['participant'];
        $submission = $result['submission'];

        $this->storeParticipantSession($participant->id, $participant->activity_id, 'pre_test', $submission->id, $submission->result_token, $data['language'] ?? 'id');

        return response()->json([
            'success' => true,
            'participant' => [
                'id' => $participant->id,
                'code' => $participant->participant_code,
                'name' => $participant->full_name,
                'role' => $participant->role,
                'school' => $participant->school?->name,
                'classroom' => $participant->classroom?->name,
            ],
            'submission_token' => $submission->result_token,
            'redirect' => route('participant.questionnaire'),
        ]);
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
