<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\EducationalTip;
use Inertia\Inertia;
use Inertia\Response;

class ResultController extends Controller
{
    public function show(string $token): Response|\Illuminate\Http\RedirectResponse
    {
        $submission = Submission::with(['participant.school', 'participant.classroom', 'questionnaireVersion'])
            ->where('result_token', $token)
            ->where('status', 'completed')
            ->first();

        if (!$submission) {
            abort(404, 'Hasil tidak ditemukan.');
        }

        // Fetch tips
        $digitalLiteracyTip = EducationalTip::where('module', 'digital_literacy')
            ->where('category', $submission->digital_literacy_category)
            ->where('is_active', true)
            ->first();

        $dataSecurityTip = EducationalTip::where('module', 'data_security')
            ->where('category', $submission->data_security_category)
            ->where('is_active', true)
            ->first();

        return Inertia::render('Participant/Result', [
            'submission' => $submission,
            'comparison' => $this->comparison($submission),
            'tips' => [
                'digital_literacy' => $digitalLiteracyTip,
                'data_security' => $dataSecurityTip,
            ],
        ]);
    }

    private function comparison(Submission $submission): ?array
    {
        if ($submission->test_type !== 'post_test') {
            return null;
        }

        $preTest = Submission::where('participant_id', $submission->participant_id)
            ->where('activity_id', $submission->activity_id)
            ->where('test_type', 'pre_test')
            ->where('status', 'completed')
            ->first();

        if (! $preTest) {
            return null;
        }

        $digitalLiteracyDiff = round($this->scoreValue($submission, 'literacy_score', 'digital_literacy_percentage') - $this->scoreValue($preTest, 'literacy_score', 'digital_literacy_percentage'), 2);
        $dataSecurityDiff = round($this->scoreValue($submission, 'security_score', 'data_security_percentage') - $this->scoreValue($preTest, 'security_score', 'data_security_percentage'), 2);
        $totalIndexDiff = round($this->scoreValue($submission, 'total_index') - $this->scoreValue($preTest, 'total_index'), 2);

        return [
            'digital_literacy' => [
                'pre' => $this->scoreValue($preTest, 'literacy_score', 'digital_literacy_percentage'),
                'post' => $this->scoreValue($submission, 'literacy_score', 'digital_literacy_percentage'),
                'diff' => $digitalLiteracyDiff,
                'pre_category' => $preTest->digital_literacy_category,
                'post_category' => $submission->digital_literacy_category,
            ],
            'data_security' => [
                'pre' => $this->scoreValue($preTest, 'security_score', 'data_security_percentage'),
                'post' => $this->scoreValue($submission, 'security_score', 'data_security_percentage'),
                'diff' => $dataSecurityDiff,
                'pre_category' => $preTest->data_security_category,
                'post_category' => $submission->data_security_category,
            ],
            'pillars' => [
                'digital_skill' => $this->comparisonMetric($preTest, $submission, 'digital_skill_score'),
                'digital_ethics' => $this->comparisonMetric($preTest, $submission, 'digital_ethics_score'),
                'digital_safety' => $this->comparisonMetric($preTest, $submission, 'digital_safety_score'),
                'digital_culture' => $this->comparisonMetric($preTest, $submission, 'digital_culture_score'),
            ],
            'total_index' => [
                'pre' => $this->scoreValue($preTest, 'total_index'),
                'post' => $this->scoreValue($submission, 'total_index'),
                'diff' => $totalIndexDiff,
                'pre_category' => $preTest->total_category ?: $preTest->digital_literacy_category,
                'post_category' => $submission->total_category ?: $submission->digital_literacy_category,
            ],
            'average_diff' => $totalIndexDiff,
            'pre_submitted_at' => optional($preTest->submitted_at)->toIso8601String(),
            'post_submitted_at' => optional($submission->submitted_at)->toIso8601String(),
        ];
    }

    private function comparisonMetric(Submission $preTest, Submission $postTest, string $scoreField): array
    {
        $pre = $this->scoreValue($preTest, $scoreField);
        $post = $this->scoreValue($postTest, $scoreField);

        return [
            'pre' => $pre,
            'post' => $post,
            'diff' => round($post - $pre, 2),
            'pre_category' => null,
            'post_category' => null,
        ];
    }

    private function scoreValue(Submission $submission, string $scoreField, ?string $legacyPercentageField = null): float
    {
        $score = round((float) $submission->{$scoreField}, 2);

        if ($score > 0) {
            return $score;
        }

        if ($legacyPercentageField) {
            $percentage = (float) $submission->{$legacyPercentageField};

            if ($percentage > 0) {
                return round($percentage / 20, 2);
            }
        }

        return 0.0;
    }
}
