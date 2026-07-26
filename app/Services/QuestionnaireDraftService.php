<?php

namespace App\Services;

use App\Models\AnswerOption;
use App\Models\Participant;
use App\Models\Question;
use App\Models\QuestionnaireVersion;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class QuestionnaireDraftService
{
    public function __construct(private ScoringService $scoringService)
    {
    }

    public function createDraft(Participant $participant, string $testType, string $language = 'id'): Submission
    {
        $version = QuestionnaireVersion::active();

        $submission = Submission::firstOrCreate(
            [
                'activity_id' => $participant->activity_id,
                'participant_id' => $participant->id,
                'test_type' => $testType,
            ],
            [
                'questionnaire_version_id' => $version?->id,
                'result_token' => Str::random(64),
                'language' => $language,
                'status' => 'draft',
                'started_at' => now(),
                'last_activity_at' => now(),
            ],
        );

        if (! $submission->questionnaire_version_id && $version && $submission->status !== 'completed' && ! $submission->answers()->exists()) {
            $submission->update(['questionnaire_version_id' => $version->id]);
        }

        return $submission->fresh();
    }

    public function saveAnswer(Submission $submission, int $questionId, int $answerOptionId, ?string $currentStep = null): SubmissionAnswer
    {
        if ($submission->status === 'completed') {
            throw ValidationException::withMessages([
                'submission' => 'Kuesioner ini sudah selesai dan tidak dapat diubah.',
            ]);
        }

        $versionId = $this->resolveVersionId($submission);
        $question = Question::with(['responseScale', 'competencies'])
            ->where('is_active', true)
            ->when($versionId, fn ($query) => $query->where('questionnaire_version_id', $versionId))
            ->findOrFail($questionId);
        $answerOption = AnswerOption::where('is_active', true)
            ->where('question_id', $question->id)
            ->findOrFail($answerOptionId);

        $answer = SubmissionAnswer::updateOrCreate(
            [
                'submission_id' => $submission->id,
                'question_id' => $question->id,
            ],
            [
                'answer_option_id' => $answerOption->id,
                'question_text_snapshot' => $question->text_id,
                'option_label_snapshot' => $answerOption->label_id,
                'weight_snapshot' => $answerOption->weight,
                'module' => $question->module,
                'kominfo_pillar' => $this->pillarFor($question),
                'question_type' => $question->question_type,
                'assessment_type' => $question->assessment_type,
                'response_scale_code' => $question->responseScale?->code,
                'competency_snapshot' => $question->competencies
                    ->map(fn ($competency) => [
                        'framework' => $competency->framework,
                        'code' => $competency->code,
                        'name' => $competency->name,
                    ])
                    ->values()
                    ->toJson(),
                'included_in_score' => (bool) $question->included_in_score,
            ],
        );

        $submission->update([
            'current_step' => $currentStep ?: $question->module,
            'current_question_id' => $question->id,
            'last_activity_at' => now(),
        ]);

        return $answer;
    }

    public function saveManyAnswers(Submission $submission, array $answers): void
    {
        foreach ($answers as $questionId => $answerOptionId) {
            $this->saveAnswer($submission, (int) $questionId, (int) $answerOptionId);
        }
    }

    public function updateProgress(Submission $submission, ?string $currentStep, ?int $currentQuestionId): void
    {
        if ($submission->status === 'completed') {
            return;
        }

        $submission->update([
            'current_step' => $currentStep,
            'current_question_id' => $currentQuestionId,
            'last_activity_at' => now(),
        ]);
    }

    public function complete(Submission $submission, array $incomingAnswers = []): Submission
    {
        return DB::transaction(function () use ($submission, $incomingAnswers) {
            $submission = $submission->fresh();

            if ($submission->status === 'completed') {
                return $submission;
            }

            if ($incomingAnswers !== []) {
                $this->saveManyAnswers($submission, $incomingAnswers);
            }

            $versionId = $this->resolveVersionId($submission);
            $questions = $this->questionQuery($versionId)->pluck('id');
            $answers = SubmissionAnswer::where('submission_id', $submission->id)
                ->whereIn('question_id', $questions)
                ->pluck('answer_option_id', 'question_id')
                ->filter()
                ->map(fn ($value) => (int) $value)
                ->all();

            $missing = $questions->filter(fn ($questionId) => ! array_key_exists((int) $questionId, $answers));

            if ($missing->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'answers' => 'Semua soal wajib dijawab sebelum kuesioner dikirim.',
                ]);
            }

            $result = $this->scoringService->calculate($answers, $versionId);

            $submission->update([
                'questionnaire_version_id' => $versionId,
                'digital_skill_score' => $result['digital_skill_score'],
                'digital_ethics_score' => $result['digital_ethics_score'],
                'digital_safety_score' => $result['digital_safety_score'],
                'digital_culture_score' => $result['digital_culture_score'],
                'literacy_score' => $result['literacy_score'],
                'security_score' => $result['security_score'],
                'total_index' => $result['total_index'],
                'knowledge_score' => $result['knowledge_score'],
                'literacy_category' => $result['literacy_category'],
                'security_category' => $result['security_category'],
                'total_category' => $result['total_category'],
                'digital_literacy_score' => $result['digital_literacy_score'],
                'digital_literacy_max_score' => $result['digital_literacy_max_score'],
                'digital_literacy_percentage' => $result['digital_literacy_percentage'],
                'digital_literacy_category' => $result['digital_literacy_category'],
                'data_security_score' => $result['data_security_score'],
                'data_security_max_score' => $result['data_security_max_score'],
                'data_security_percentage' => $result['data_security_percentage'],
                'data_security_category' => $result['data_security_category'],
                'status' => 'completed',
                'submitted_at' => now(),
                'completed_at' => now(),
                'last_activity_at' => now(),
            ]);

            return $submission->fresh();
        });
    }

    public function progress(Submission $submission): array
    {
        $questionIds = $this->questionQuery($this->resolveVersionId($submission))->pluck('id');
        $total = $questionIds->count();
        $answered = $submission->answers()
            ->whereIn('question_id', $questionIds)
            ->distinct('question_id')
            ->count('question_id');

        return [
            'answered' => $answered,
            'total' => $total,
            'percentage' => $total > 0 ? round(($answered / $total) * 100) : 0,
            'current_step' => $submission->current_step,
            'current_question_id' => $submission->current_question_id,
            'last_activity_at' => optional($submission->last_activity_at)->toIso8601String(),
        ];
    }

    public function answerMap(Submission $submission): array
    {
        $questionIds = $this->questionQuery($this->resolveVersionId($submission))->pluck('id');

        return $submission->answers()
            ->whereIn('question_id', $questionIds)
            ->whereNotNull('answer_option_id')
            ->pluck('answer_option_id', 'question_id')
            ->map(fn ($value) => (int) $value)
            ->all();
    }

    private function resolveVersionId(Submission $submission): ?int
    {
        if ($submission->questionnaire_version_id) {
            return (int) $submission->questionnaire_version_id;
        }

        $version = QuestionnaireVersion::active();

        if ($version && $submission->status !== 'completed' && ! $submission->answers()->exists()) {
            $submission->update(['questionnaire_version_id' => $version->id]);

            return $version->id;
        }

        return $version?->id;
    }

    private function questionQuery(?int $versionId)
    {
        return Question::where('is_active', true)
            ->when($versionId, fn ($query) => $query->where('questionnaire_version_id', $versionId))
            ->orderBy('display_order');
    }

    private function pillarFor(Question $question): ?string
    {
        if (in_array($question->kominfo_pillar, ['digital_skill', 'digital_ethics', 'digital_safety', 'digital_culture'], true)) {
            return $question->kominfo_pillar;
        }

        return match ($question->module) {
            'data_security' => 'digital_safety',
            'digital_literacy' => 'digital_skill',
            default => null,
        };
    }
}
