<?php

namespace App\Http\Requests\Participant;

use App\Models\Question;
use App\Models\QuestionnaireVersion;
use App\Models\Submission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SubmitQuestionnaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'participant_id' => ['required', 'integer', 'exists:participants,id'],
            'test_type' => ['required', 'string', 'in:pre_test,post_test'],
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
            'language' => ['required', 'string', 'in:id,en'],
            'answers' => ['required', 'array'],
            'answers.*' => ['required', 'integer', 'exists:answer_options,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $versionId = $this->questionnaireVersionId();

            $questions = Question::with(['answerOptions' => function ($query) {
                $query->where('is_active', true);
            }])
                ->where('is_active', true)
                ->when($versionId, fn ($query) => $query->where('questionnaire_version_id', $versionId))
                ->get();

            if ($questions->isEmpty()) {
                $validator->errors()->add('answers', 'Belum ada soal aktif yang dapat dijawab.');
                return;
            }

            $answers = collect($this->input('answers', []))
                ->mapWithKeys(fn ($optionId, $questionId) => [(int) $questionId => (int) $optionId]);

            $missingQuestionIds = $questions
                ->filter(fn (Question $question) => ! $answers->has($question->id))
                ->pluck('id');

            if ($missingQuestionIds->isNotEmpty()) {
                $validator->errors()->add('answers', 'Semua soal wajib dijawab sebelum kuesioner dikirim.');
                return;
            }

            foreach ($questions as $question) {
                $selectedOptionId = $answers->get($question->id);

                if (! $question->answerOptions->contains('id', $selectedOptionId)) {
                    $validator->errors()->add(
                        "answers.{$question->id}",
                        'Pilihan jawaban tidak valid untuk salah satu soal.'
                    );
                }
            }
        });
    }

    private function questionnaireVersionId(): ?int
    {
        $session = session('participant_session');
        $submissionId = (int) ($session['submission_id'] ?? 0);

        if ($submissionId > 0) {
            $submission = Submission::find($submissionId);

            if ($submission?->questionnaire_version_id) {
                return (int) $submission->questionnaire_version_id;
            }
        }

        return QuestionnaireVersion::active()?->id;
    }
}
