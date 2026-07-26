<?php

namespace App\Services;

use App\Enums\CategoryEnum;
use App\Models\CategoryThreshold;
use App\Models\Question;
use App\Models\QuestionnaireVersion;

class ScoringService
{
    private const PILLARS = [
        'digital_skill',
        'digital_ethics',
        'digital_safety',
        'digital_culture',
    ];

    /**
     * Calculate questionnaire scores.
     *
     * @param array $answers Format: ['question_id' => 'answer_option_id']
     */
    public function calculate(array $answers, ?int $questionnaireVersionId = null): array
    {
        $questions = $this->questionQuery($questionnaireVersionId)
            ->with([
                'answerOptions' => fn ($query) => $query->where('is_active', true)->orderBy('display_order'),
                'responseScale',
                'competencies',
            ])
            ->get();

        $pillarSums = array_fill_keys(self::PILLARS, 0.0);
        $pillarCounts = array_fill_keys(self::PILLARS, 0);
        $answerDetails = [];

        foreach ($questions as $question) {
            $selectedOptionId = $answers[$question->id] ?? null;
            $selectedOption = $selectedOptionId
                ? $question->answerOptions->firstWhere('id', (int) $selectedOptionId)
                : null;

            if (! $selectedOption) {
                continue;
            }

            $rawWeight = (float) $selectedOption->weight;
            $weight = $this->normalizedWeight($question, $rawWeight);
            $pillar = $this->pillarFor($question);

            if ($question->included_in_score && $pillar) {
                $pillarSums[$pillar] += $weight;
                $pillarCounts[$pillar]++;
            }

            $answerDetails[] = [
                'question_id' => $question->id,
                'answer_option_id' => $selectedOption->id,
                'question_text_snapshot' => $question->text_id,
                'option_label_snapshot' => $selectedOption->label_id,
                'weight_snapshot' => $weight,
                'module' => $question->module,
                'kominfo_pillar' => $pillar,
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
            ];
        }

        $pillarScores = [];
        foreach (self::PILLARS as $pillar) {
            $pillarScores[$pillar] = $pillarCounts[$pillar] > 0
                ? round($pillarSums[$pillar] / $pillarCounts[$pillar], 2)
                : 0.0;
        }

        $literacyScore = $this->averageAvailable($pillarScores, $pillarCounts, [
            'digital_skill',
            'digital_ethics',
            'digital_culture',
        ]);
        $securityScore = $pillarCounts['digital_safety'] > 0 ? $pillarScores['digital_safety'] : 0.0;
        $totalIndex = $this->averageAvailable($pillarScores, $pillarCounts, self::PILLARS);

        $literacyCategory = $this->determineCategory('digital_literacy', $literacyScore);
        $securityCategory = $this->determineCategory('data_security', $securityScore);
        $totalCategory = $this->determineCategory('total_index', $totalIndex);

        return [
            'digital_skill_score' => $pillarScores['digital_skill'],
            'digital_ethics_score' => $pillarScores['digital_ethics'],
            'digital_safety_score' => $pillarScores['digital_safety'],
            'digital_culture_score' => $pillarScores['digital_culture'],
            'literacy_score' => $literacyScore,
            'security_score' => $securityScore,
            'total_index' => $totalIndex,
            'knowledge_score' => null,
            'literacy_category' => $literacyCategory,
            'security_category' => $securityCategory,
            'total_category' => $totalCategory,
            'digital_literacy_score' => $literacyScore,
            'digital_literacy_max_score' => 5,
            'digital_literacy_percentage' => $this->toPercentage($literacyScore),
            'digital_literacy_category' => $literacyCategory,
            'data_security_score' => $securityScore,
            'data_security_max_score' => 5,
            'data_security_percentage' => $this->toPercentage($securityScore),
            'data_security_category' => $securityCategory,
            'details' => $answerDetails,
        ];
    }

    public function determineCategory(string $module, float $score): string
    {
        $threshold = CategoryThreshold::where('module', $module)
            ->where('is_active', true)
            ->where('minimum_percentage', '<=', $score)
            ->where('maximum_percentage', '>=', $score)
            ->orderByDesc('version')
            ->first();

        if ($threshold) {
            return $threshold->category;
        }

        return match (true) {
            $score >= 3.67 => CategoryEnum::HIGH->value,
            $score >= 2.34 => CategoryEnum::MEDIUM->value,
            default => CategoryEnum::LOW->value,
        };
    }

    private function questionQuery(?int $questionnaireVersionId)
    {
        $query = Question::where('is_active', true)->orderBy('display_order');

        if ($questionnaireVersionId) {
            return $query->where('questionnaire_version_id', $questionnaireVersionId);
        }

        $activeVersion = QuestionnaireVersion::active();

        return $activeVersion
            ? $query->where('questionnaire_version_id', $activeVersion->id)
            : $query;
    }

    private function normalizedWeight(Question $question, float $weight): float
    {
        if (! $question->is_reverse) {
            return round($weight, 2);
        }

        $min = (float) ($question->answerOptions->min('weight') ?? 1);
        $max = (float) ($question->answerOptions->max('weight') ?? 5);

        return round(($min + $max) - $weight, 2);
    }

    private function pillarFor(Question $question): ?string
    {
        if (in_array($question->kominfo_pillar, self::PILLARS, true)) {
            return $question->kominfo_pillar;
        }

        return match ($question->module) {
            'data_security' => 'digital_safety',
            'digital_literacy' => 'digital_skill',
            default => null,
        };
    }

    private function averageAvailable(array $scores, array $counts, array $keys): float
    {
        $values = [];

        foreach ($keys as $key) {
            if (($counts[$key] ?? 0) > 0) {
                $values[] = (float) $scores[$key];
            }
        }

        return $values === [] ? 0.0 : round(array_sum($values) / count($values), 2);
    }

    private function toPercentage(float $score): float
    {
        return round(max(0, min(5, $score)) / 5 * 100, 2);
    }
}
