<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Participant;
use App\Models\School;
use App\Models\Submission;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $completeParticipants = Participant::whereHas('submissions', function ($query) {
            $query->where('test_type', 'pre_test')->where('status', 'completed');
        })->whereHas('submissions', function ($query) {
            $query->where('test_type', 'post_test')->where('status', 'completed');
        })->count();

        $totalParticipants = Participant::count();

        $averagesByTest = Submission::query()
            ->where('status', 'completed')
            ->select('test_type')
            ->selectRaw('AVG(digital_literacy_percentage) as digital_literacy')
            ->selectRaw('AVG(data_security_percentage) as data_security')
            ->groupBy('test_type')
            ->get()
            ->keyBy('test_type');

        $chartData = collect([
            ['key' => 'pre_test', 'name' => 'Pre-Test'],
            ['key' => 'post_test', 'name' => 'Post-Test'],
        ])->map(function (array $item) use ($averagesByTest) {
            $row = $averagesByTest->get($item['key']);

            return [
                'name' => $item['name'],
                'literasi' => round((float) ($row?->digital_literacy ?? 0), 2),
                'keamanan' => round((float) ($row?->data_security ?? 0), 2),
            ];
        })->values();

        $recentActivities = Submission::with('participant:id,full_name')
            ->where('status', 'completed')
            ->latest('submitted_at')
            ->limit(5)
            ->get()
            ->map(fn (Submission $submission) => [
                'id' => $submission->id,
                'participant' => $submission->participant?->full_name ?? 'Peserta',
                'test_type' => $submission->test_type,
                'submitted_at' => optional($submission->submitted_at)->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_participants' => $totalParticipants,
                'total_pre_test' => Submission::where('test_type', 'pre_test')->where('status', 'completed')->count(),
                'total_post_test' => Submission::where('test_type', 'post_test')->where('status', 'completed')->count(),
                'draft_submissions' => Submission::where('status', 'draft')->count(),
                'complete_participants' => $completeParticipants,
                'incomplete_participants' => max($totalParticipants - $completeParticipants, 0),
                'avg_digital_literacy' => round((float) Submission::where('status', 'completed')->avg('digital_literacy_percentage'), 2),
                'avg_data_security' => round((float) Submission::where('status', 'completed')->avg('data_security_percentage'), 2),
                'total_schools' => School::count(),
                'active_activities' => Activity::where('is_active', true)->count(),
            ],
            'chartData' => $chartData,
            'recentActivities' => $recentActivities,
        ]);
    }
}
