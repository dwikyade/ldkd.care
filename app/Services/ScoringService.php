<?php

namespace App\Services;

use App\Enums\CategoryEnum;
use App\Models\CategoryThreshold;
use App\Models\Question;

class ScoringService
{
    /**
     * Calculate scores based on provided answers.
     * 
     * @param array $answers Format: ['question_id' => 'answer_option_id']
     * @return array
     */
    public function calculate(array $answers): array
    {
        $digitalLiteracyScore = 0;
        $digitalLiteracyMax = 0;
        $dataSecurityScore = 0;
        $dataSecurityMax = 0;

        // Fetch all questions and their active options
        $questions = Question::with(['answerOptions' => function($q) {
            $q->where('is_active', true);
        }])->where('is_active', true)->get();

        $answerDetails = [];

        foreach ($questions as $question) {
            $selectedOptionId = $answers[$question->id] ?? null;
            $selectedOption = null;
            $maxWeight = $question->answerOptions->max('weight') ?? 0;

            if ($selectedOptionId) {
                $selectedOption = $question->answerOptions->firstWhere('id', $selectedOptionId);
            }

            $weight = $selectedOption ? $selectedOption->weight : 0;

            if ($question->module === 'digital_literacy') {
                $digitalLiteracyScore += $weight;
                $digitalLiteracyMax += $maxWeight;
            } elseif ($question->module === 'data_security') {
                $dataSecurityScore += $weight;
                $dataSecurityMax += $maxWeight;
            }

            if ($selectedOption) {
                $answerDetails[] = [
                    'question_id' => $question->id,
                    'answer_option_id' => $selectedOption->id,
                    'question_text_snapshot' => $question->text_id,
                    'option_label_snapshot' => $selectedOption->label_id,
                    'weight_snapshot' => $weight,
                    'module' => $question->module,
                ];
            }
        }

        $dlPercentage = $digitalLiteracyMax > 0 ? ($digitalLiteracyScore / $digitalLiteracyMax) * 100 : 0;
        $dsPercentage = $dataSecurityMax > 0 ? ($dataSecurityScore / $dataSecurityMax) * 100 : 0;

        return [
            'digital_literacy_score' => $digitalLiteracyScore,
            'digital_literacy_max_score' => $digitalLiteracyMax,
            'digital_literacy_percentage' => $dlPercentage,
            'digital_literacy_category' => $this->determineCategory('digital_literacy', $dlPercentage),
            'data_security_score' => $dataSecurityScore,
            'data_security_max_score' => $dataSecurityMax,
            'data_security_percentage' => $dsPercentage,
            'data_security_category' => $this->determineCategory('data_security', $dsPercentage),
            'details' => $answerDetails,
        ];
    }

    public function determineCategory(string $module, float $percentage): string
    {
        $threshold = CategoryThreshold::where('module', $module)
            ->where('is_active', true)
            ->where('minimum_percentage', '<=', $percentage)
            ->where('maximum_percentage', '>=', $percentage)
            ->first();

        return $threshold ? $threshold->category : CategoryEnum::LOW->value;
    }
}
