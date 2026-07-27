<?php

namespace App\Services;

use App\Models\Classroom;
use App\Models\Participant;
use App\Models\School;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ParticipantRegistrationService
{
    public function __construct(
        private ParticipantCodeService $codeService,
        private QuestionnaireDraftService $draftService,
    ) {
    }

    public function registerPreTest(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $participantCode = $this->codeService->makeCode($data['suffix']);

            $school = $this->resolveSchool($data);
            $classroom = ($data['role'] ?? 'student') === 'student'
                ? $this->resolveClassroom($school, $data)
                : null;

            try {
                $participant = Participant::create([
                    'activity_id' => $data['activity_id'],
                    'participant_code' => $participantCode,
                    'full_name' => $data['full_name'],
                    'email' => strtolower(trim((string) $data['email'])),
                    'role' => $data['role'],
                    'school_id' => $school->id,
                    'class_id' => $classroom?->id,
                    'gender' => $data['gender'] ?? null,
                    'position' => $data['position'] ?? null,
                    'is_active' => true,
                ]);
            } catch (QueryException) {
                throw ValidationException::withMessages([
                    'suffix' => 'Kode sudah digunakan, silakan buat kode lain.',
                ]);
            }

            $submission = $this->draftService->createDraft($participant, 'pre_test', $data['language'] ?? 'id');

            return [
                'participant' => $participant->load(['school', 'classroom']),
                'submission' => $submission,
            ];
        });
    }

    private function resolveSchool(array $data): School
    {
        if (! empty($data['school_id'])) {
            return School::findOrFail($data['school_id']);
        }

        return School::firstOrCreate(
            ['name' => trim($data['school_name'])],
            ['is_active' => true],
        );
    }

    private function resolveClassroom(School $school, array $data): ?Classroom
    {
        if (! empty($data['class_id'])) {
            return Classroom::where('school_id', $school->id)->findOrFail($data['class_id']);
        }

        if (blank($data['class_name'] ?? null)) {
            return null;
        }

        return Classroom::firstOrCreate(
            [
                'school_id' => $school->id,
                'name' => trim($data['class_name']),
            ],
            ['is_active' => true],
        );
    }
}
