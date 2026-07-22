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
        $submission = clone Submission::with('participant')->where('result_token', $token)->first();

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
            'tips' => [
                'digital_literacy' => $digitalLiteracyTip,
                'data_security' => $dataSecurityTip,
            ],
        ]);
    }
}
