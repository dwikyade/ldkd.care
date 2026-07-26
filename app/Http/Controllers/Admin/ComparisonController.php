<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Participant;
use App\Models\School;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class ComparisonController extends Controller
{
    public function index(Request $request): Response
    {
        $baseQuery = $this->query($request);
        $summaryRows = (clone $baseQuery)->get()->map(fn (Participant $participant) => $this->mapComparison($participant));
        $completeRows = $summaryRows->filter(fn (array $row) => $row['status'] === 'complete');

        $participants = (clone $baseQuery)
            ->orderBy('full_name')
            ->paginate(12)
            ->withQueryString();

        $participants->getCollection()->transform(fn (Participant $participant) => $this->mapComparison($participant));

        return Inertia::render('Admin/Comparisons/Index', [
            'comparisons' => $participants,
            'filters' => $request->only(['search', 'activity_id', 'school_id', 'role', 'status']),
            'activities' => Activity::orderBy('name')->get(['id', 'name']),
            'schools' => School::orderBy('name')->get(['id', 'name']),
            'summary' => [
                'total' => $summaryRows->count(),
                'complete' => $completeRows->count(),
                'incomplete' => $summaryRows->count() - $completeRows->count(),
                'avg_digital_literacy_diff' => round((float) $completeRows->avg('digital_literacy_diff'), 2),
                'avg_data_security_diff' => round((float) $completeRows->avg('data_security_diff'), 2),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $filename = 'ldkd-comparisons-' . now()->format('Ymd-His') . '.csv';
        AuditLogger::record('export_comparisons', 'Participant', null, null, $request->query());

        return response()->streamDownload(function () use ($request) {
            $output = fopen('php://output', 'w');
            fwrite($output, "\xEF\xBB\xBF");
            fputcsv($output, [
                'Kode Peserta',
                'Nama',
                'Peran',
                'Sekolah',
                'Kelas',
                'Pre Literasi (%)',
                'Post Literasi (%)',
                'Selisih Literasi (%)',
                'Pre Keamanan (%)',
                'Post Keamanan (%)',
                'Selisih Keamanan (%)',
                'Pre Digital Skill (1-5)',
                'Post Digital Skill (1-5)',
                'Selisih Digital Skill',
                'Pre Digital Ethics (1-5)',
                'Post Digital Ethics (1-5)',
                'Selisih Digital Ethics',
                'Pre Digital Safety (1-5)',
                'Post Digital Safety (1-5)',
                'Selisih Digital Safety',
                'Pre Digital Culture (1-5)',
                'Post Digital Culture (1-5)',
                'Selisih Digital Culture',
                'Pre Skor Literasi (1-5)',
                'Post Skor Literasi (1-5)',
                'Selisih Skor Literasi',
                'Pre Skor Keamanan (1-5)',
                'Post Skor Keamanan (1-5)',
                'Selisih Skor Keamanan',
                'Pre Total Index (1-5)',
                'Post Total Index (1-5)',
                'Selisih Total Index',
                'Status',
            ]);

            $this->query($request)
                ->orderBy('full_name')
                ->chunk(200, function ($participants) use ($output) {
                    foreach ($participants as $participant) {
                        $row = $this->mapComparison($participant);
                        fputcsv($output, [
                            $row['participant_code'],
                            $row['full_name'],
                            $row['role'],
                            $row['school'],
                            $row['classroom'],
                            $row['pre_digital_literacy'],
                            $row['post_digital_literacy'],
                            $row['digital_literacy_diff'],
                            $row['pre_data_security'],
                            $row['post_data_security'],
                            $row['data_security_diff'],
                            $row['pre_digital_skill_score'],
                            $row['post_digital_skill_score'],
                            $row['digital_skill_diff'],
                            $row['pre_digital_ethics_score'],
                            $row['post_digital_ethics_score'],
                            $row['digital_ethics_diff'],
                            $row['pre_digital_safety_score'],
                            $row['post_digital_safety_score'],
                            $row['digital_safety_diff'],
                            $row['pre_digital_culture_score'],
                            $row['post_digital_culture_score'],
                            $row['digital_culture_diff'],
                            $row['pre_literacy_score'],
                            $row['post_literacy_score'],
                            $row['literacy_score_diff'],
                            $row['pre_security_score'],
                            $row['post_security_score'],
                            $row['security_score_diff'],
                            $row['pre_total_index'],
                            $row['post_total_index'],
                            $row['total_index_diff'],
                            $row['status'],
                        ]);
                    }
                });

            fclose($output);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    private function query(Request $request)
    {
        return Participant::with([
                'school',
                'classroom',
                'submissions' => fn ($query) => $query->where('status', 'completed'),
            ])
            ->when($request->query('search'), function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('full_name', 'like', "%{$search}%")
                        ->orWhere('participant_code', 'like', "%{$search}%");
                });
            })
            ->when($request->query('activity_id'), fn ($query, $activityId) => $query->where('activity_id', $activityId))
            ->when($request->query('school_id'), fn ($query, $schoolId) => $query->where('school_id', $schoolId))
            ->when($request->query('role'), fn ($query, $role) => $query->where('role', $role))
            ->when($request->query('status'), function ($query, string $status) {
                if ($status === 'complete') {
                    $query->whereHas('submissions', fn ($query) => $query->where('test_type', 'pre_test')->where('status', 'completed'))
                        ->whereHas('submissions', fn ($query) => $query->where('test_type', 'post_test')->where('status', 'completed'));
                }

                if ($status === 'incomplete') {
                    $query->where(function ($query) {
                        $query->whereDoesntHave('submissions', fn ($query) => $query->where('test_type', 'pre_test')->where('status', 'completed'))
                            ->orWhereDoesntHave('submissions', fn ($query) => $query->where('test_type', 'post_test')->where('status', 'completed'));
                    });
                }
            });
    }

    private function mapComparison(Participant $participant): array
    {
        $pre = $participant->submissions->firstWhere('test_type', 'pre_test');
        $post = $participant->submissions->firstWhere('test_type', 'post_test');
        $isComplete = $pre && $post;

        return [
            'id' => $participant->id,
            'participant_code' => $participant->participant_code,
            'full_name' => $participant->full_name,
            'role' => $participant->role,
            'school' => $participant->school?->name,
            'classroom' => $participant->classroom?->name,
            'pre_digital_literacy' => $pre?->digital_literacy_percentage,
            'post_digital_literacy' => $post?->digital_literacy_percentage,
            'digital_literacy_diff' => $isComplete ? round($post->digital_literacy_percentage - $pre->digital_literacy_percentage, 2) : null,
            'pre_data_security' => $pre?->data_security_percentage,
            'post_data_security' => $post?->data_security_percentage,
            'data_security_diff' => $isComplete ? round($post->data_security_percentage - $pre->data_security_percentage, 2) : null,
            'pre_digital_skill_score' => $pre ? $this->scoreValue($pre->digital_skill_score) : null,
            'post_digital_skill_score' => $post ? $this->scoreValue($post->digital_skill_score) : null,
            'digital_skill_diff' => $isComplete ? $this->scoreDiff($pre->digital_skill_score, $post->digital_skill_score) : null,
            'pre_digital_ethics_score' => $pre ? $this->scoreValue($pre->digital_ethics_score) : null,
            'post_digital_ethics_score' => $post ? $this->scoreValue($post->digital_ethics_score) : null,
            'digital_ethics_diff' => $isComplete ? $this->scoreDiff($pre->digital_ethics_score, $post->digital_ethics_score) : null,
            'pre_digital_safety_score' => $pre ? $this->scoreValue($pre->digital_safety_score) : null,
            'post_digital_safety_score' => $post ? $this->scoreValue($post->digital_safety_score) : null,
            'digital_safety_diff' => $isComplete ? $this->scoreDiff($pre->digital_safety_score, $post->digital_safety_score) : null,
            'pre_digital_culture_score' => $pre ? $this->scoreValue($pre->digital_culture_score) : null,
            'post_digital_culture_score' => $post ? $this->scoreValue($post->digital_culture_score) : null,
            'digital_culture_diff' => $isComplete ? $this->scoreDiff($pre->digital_culture_score, $post->digital_culture_score) : null,
            'pre_literacy_score' => $pre ? $this->scoreValue($pre->literacy_score ?: ((float) $pre->digital_literacy_percentage / 20)) : null,
            'post_literacy_score' => $post ? $this->scoreValue($post->literacy_score ?: ((float) $post->digital_literacy_percentage / 20)) : null,
            'literacy_score_diff' => $isComplete ? $this->scoreDiff($pre->literacy_score ?: ((float) $pre->digital_literacy_percentage / 20), $post->literacy_score ?: ((float) $post->digital_literacy_percentage / 20)) : null,
            'pre_security_score' => $pre ? $this->scoreValue($pre->security_score ?: ((float) $pre->data_security_percentage / 20)) : null,
            'post_security_score' => $post ? $this->scoreValue($post->security_score ?: ((float) $post->data_security_percentage / 20)) : null,
            'security_score_diff' => $isComplete ? $this->scoreDiff($pre->security_score ?: ((float) $pre->data_security_percentage / 20), $post->security_score ?: ((float) $post->data_security_percentage / 20)) : null,
            'pre_total_index' => $pre ? $this->scoreValue($pre->total_index) : null,
            'post_total_index' => $post ? $this->scoreValue($post->total_index) : null,
            'total_index_diff' => $isComplete ? $this->scoreDiff($pre->total_index, $post->total_index) : null,
            'status' => $isComplete ? 'complete' : 'incomplete',
        ];
    }

    private function scoreValue(float|string|null $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        return round((float) $value, 2);
    }

    private function scoreDiff(float|string|null $pre, float|string|null $post): ?float
    {
        if ($pre === null || $post === null || $pre === '' || $post === '') {
            return null;
        }

        return round((float) $post - (float) $pre, 2);
    }
}
