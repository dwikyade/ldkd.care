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
        $submission = Submission::with(['participant.school', 'participant.classroom'])
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

        $digitalLiteracyDiff = round((float) $submission->digital_literacy_percentage - (float) $preTest->digital_literacy_percentage, 2);
        $dataSecurityDiff = round((float) $submission->data_security_percentage - (float) $preTest->data_security_percentage, 2);

        return [
            'digital_literacy' => [
                'pre' => round((float) $preTest->digital_literacy_percentage, 2),
                'post' => round((float) $submission->digital_literacy_percentage, 2),
                'diff' => $digitalLiteracyDiff,
                'pre_category' => $preTest->digital_literacy_category,
                'post_category' => $submission->digital_literacy_category,
            ],
            'data_security' => [
                'pre' => round((float) $preTest->data_security_percentage, 2),
                'post' => round((float) $submission->data_security_percentage, 2),
                'diff' => $dataSecurityDiff,
                'pre_category' => $preTest->data_security_category,
                'post_category' => $submission->data_security_category,
            ],
            'average_diff' => round(($digitalLiteracyDiff + $dataSecurityDiff) / 2, 2),
            'pre_submitted_at' => optional($preTest->submitted_at)->toIso8601String(),
            'post_submitted_at' => optional($submission->submitted_at)->toIso8601String(),
        ];
    }
}
