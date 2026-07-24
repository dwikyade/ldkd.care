<?php

namespace App\Services;

use App\Models\Participant;
use App\Models\Submission;

class PreTestEligibilityService
{
    public function __construct(private ParticipantCodeService $codeService, private QuestionnaireDraftService $draftService)
    {
    }

    public function check(int $activityId, string $suffix, string $role): array
    {
        $code = $this->codeService->makeCode($this->codeService->extractSuffix($suffix));
        $participant = Participant::with(['school', 'classroom'])
            ->where('activity_id', $activityId)
            ->whereRaw('UPPER(participant_code) = ?', [$code])
            ->where('role', $role)
            ->where('is_active', true)
            ->whereNull('merged_into_id')
            ->first();

        if (! $participant) {
            return [
                'status' => 'CODE_NOT_FOUND',
                'message' => 'Kode peserta tidak ditemukan. Pastikan kode benar atau buat kode baru untuk memulai Pre-Test.',
            ];
        }

        $submission = $participant->submissions()->where('test_type', 'pre_test')->first();

        if (! $submission) {
            return [
                'status' => 'PRETEST_NOT_FOUND',
                'message' => 'Pre-Test belum pernah dimulai untuk kode ini.',
            ];
        }

        if ($submission->status === 'completed') {
            return [
                'status' => 'PRETEST_COMPLETED',
                'message' => 'Pre-Test dengan kode ini sudah selesai. Gunakan kode yang sama saat Post-Test.',
                'participant' => $this->maskedParticipant($participant),
                'completed_at' => optional($submission->completed_at ?? $submission->submitted_at)->toIso8601String(),
            ];
        }

        return [
            'status' => 'PRETEST_DRAFT',
            'message' => 'Pre-Test Anda belum selesai. Jawaban terakhir telah tersimpan dan dapat dilanjutkan.',
            'participant' => $this->maskedParticipant($participant),
            'progress' => $this->draftService->progress($submission),
            'submission_token' => $submission->result_token,
        ];
    }

    private function maskedParticipant(Participant $participant): array
    {
        return [
            'name' => $this->mask($participant->full_name),
            'school' => $this->mask($participant->school?->name ?? '-'),
            'classroom' => $participant->classroom?->name,
            'code' => $participant->participant_code,
        ];
    }

    private function mask(string $value): string
    {
        $value = trim($value);
        if (strlen($value) <= 2) {
            return $value;
        }

        return substr($value, 0, 1) . str_repeat('*', max(strlen($value) - 2, 2)) . substr($value, -1);
    }
}
