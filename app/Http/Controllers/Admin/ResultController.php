<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\School;
use App\Models\Submission;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class ResultController extends Controller
{
    public function index(Request $request): Response
    {
        $results = $this->query($request)
            ->latest('submitted_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Results/Index', [
            'results' => $results,
            'filters' => $request->only(['search', 'activity_id', 'school_id', 'test_type']),
            'activities' => Activity::orderBy('name')->get(['id', 'name']),
            'schools' => School::orderBy('name')->get(['id', 'name']),
            'summary' => [
                'total' => (clone $this->query($request))->count(),
                'avg_digital_literacy' => round((float) (clone $this->query($request))->avg('digital_literacy_percentage'), 2),
                'avg_data_security' => round((float) (clone $this->query($request))->avg('data_security_percentage'), 2),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $filename = 'ldkd-results-' . now()->format('Ymd-His') . '.csv';
        AuditLogger::record('export_results', 'Submission', null, null, $request->query());

        return response()->streamDownload(function () use ($request) {
            $output = fopen('php://output', 'w');
            fwrite($output, "\xEF\xBB\xBF");
            fputcsv($output, [
                'Kode Peserta',
                'Nama',
                'Peran',
                'Sekolah',
                'Kelas',
                'Kegiatan',
                'Jenis Tes',
                'Versi Instrumen',
                'Digital Skill (1-5)',
                'Digital Ethics (1-5)',
                'Digital Safety (1-5)',
                'Digital Culture (1-5)',
                'Skor Literasi (1-5)',
                'Kategori Literasi',
                'Skor Keamanan (1-5)',
                'Kategori Keamanan',
                'Total Index (1-5)',
                'Kategori Total',
                'Literasi Digital (%)',
                'Keamanan Digital (%)',
                'Tanggal Submit',
            ]);

            $this->query($request)
                ->latest('submitted_at')
                ->chunk(200, function ($submissions) use ($output) {
                    foreach ($submissions as $submission) {
                        fputcsv($output, [
                            $submission->participant?->participant_code,
                            $submission->participant?->full_name,
                            $submission->participant?->role,
                            $submission->participant?->school?->name,
                            $submission->participant?->classroom?->name,
                            $submission->activity?->name,
                            $submission->test_type,
                            $submission->questionnaireVersion?->code,
                            $submission->digital_skill_score,
                            $submission->digital_ethics_score,
                            $submission->digital_safety_score,
                            $submission->digital_culture_score,
                            $submission->literacy_score ?: $this->scoreFromPercentage($submission->digital_literacy_percentage),
                            $submission->literacy_category ?: $submission->digital_literacy_category,
                            $submission->security_score ?: $this->scoreFromPercentage($submission->data_security_percentage),
                            $submission->security_category ?: $submission->data_security_category,
                            $submission->total_index,
                            $submission->total_category,
                            $submission->digital_literacy_percentage,
                            $submission->data_security_percentage,
                            optional($submission->submitted_at)->format('Y-m-d H:i:s'),
                        ]);
                    }
                });

            fclose($output);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    private function query(Request $request)
    {
        return Submission::with(['participant.school', 'participant.classroom', 'activity', 'questionnaireVersion'])
            ->where('status', 'completed')
            ->when($request->query('search'), function ($query, string $search) {
                $query->whereHas('participant', function ($query) use ($search) {
                    $query->where('full_name', 'like', "%{$search}%")
                        ->orWhere('participant_code', 'like', "%{$search}%");
                });
            })
            ->when($request->query('activity_id'), fn ($query, $activityId) => $query->where('activity_id', $activityId))
            ->when($request->query('test_type'), fn ($query, $testType) => $query->where('test_type', $testType))
            ->when($request->query('school_id'), function ($query, $schoolId) {
                $query->whereHas('participant', fn ($query) => $query->where('school_id', $schoolId));
            });
    }

    private function scoreFromPercentage(float|string|null $percentage): float
    {
        return round(((float) $percentage) / 20, 2);
    }
}
