<?php

namespace App\Services;

use App\Models\Participant;

class PostTestEligibilityService
{
    public function __construct(private ParticipantCodeService $codeService, private QuestionnaireDraftService $draftService)
    {
    }

    public function check(int $activityId, string $suffix, string $role): array
    {
        $code = $this->codeService->makeCode($this->codeService->extractSuffix($suffix));
        $participant = Participant::with(['school', 'classroom', 'submissions'])
            ->where('activity_id', $activityId)
            ->whereRaw('UPPER(participant_code) = ?', [$code])
            ->where('role', $role)
            ->where('is_active', true)
            ->whereNull('merged_into_id')
            ->first();

        if (! $participant) {
            return [
                'status' => 'CODE_NOT_FOUND',
                'message' => 'Kode peserta tidak ditemukan. Untuk mengisi Post-Test, gunakan kode yang sama dengan Pre-Test.',
            ];
        }

        $pre = $participant->submissions->firstWhere('test_type', 'pre_test');
        $post = $participant->submissions->firstWhere('test_type', 'post_test');

        if (! $pre) {
            return [
                'status' => 'PRETEST_NOT_FOUND',
                'message' => 'Data Pre-Test untuk kode ini belum ditemukan. Anda harus menyelesaikan Pre-Test terlebih dahulu.',
                'participant' => $this->participantSummary($participant),
            ];
        }

        if ($pre->status !== 'completed') {
            return [
                'status' => 'PRETEST_INCOMPLETE',
                'message' => 'Pre-Test Anda belum selesai. Selesaikan seluruh pertanyaan sebelum melanjutkan Post-Test.',
                'participant' => $this->participantSummary($participant),
                'progress' => $this->draftService->progress($pre),
                'submission_token' => $pre->result_token,
            ];
        }

        if (! $post) {
            return [
                'status' => 'POSTTEST_AVAILABLE',
                'message' => 'Pre-Test selesai. Anda dapat memulai Post-Test dengan kode yang sama.',
                'participant' => $this->participantSummary($participant),
                'pretest_completed_at' => optional($pre->completed_at ?? $pre->submitted_at)->toIso8601String(),
            ];
        }

        if ($post->status === 'completed') {
            return [
                'status' => 'POSTTEST_COMPLETED',
                'message' => 'Post-Test dengan kode ini sudah selesai.',
                'participant' => $this->participantSummary($participant),
                'completed_at' => optional($post->completed_at ?? $post->submitted_at)->toIso8601String(),
            ];
        }

        return [
            'status' => 'POSTTEST_INCOMPLETE',
            'message' => 'Post-Test Anda belum selesai. Jawaban sebelumnya sudah tersimpan.',
            'participant' => $this->participantSummary($participant),
            'progress' => $this->draftService->progress($post),
            'submission_token' => $post->result_token,
        ];
    }

    public function participantSummary(Participant $participant): array
    {
        return [
            'code' => $participant->participant_code,
            'name' => $participant->full_name,
            'email' => $participant->email,
            'role' => $participant->role,
            'school' => $participant->school?->name,
            'classroom' => $participant->classroom?->name,
        ];
    }
}
