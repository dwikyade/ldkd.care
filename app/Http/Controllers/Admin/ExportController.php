<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Participant;
use App\Models\School;
use App\Models\Submission;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Export/Index', [
            'activities' => Activity::orderBy('name')->get(['id', 'name']),
            'schools' => School::orderBy('name')->get(['id', 'name']),
            'summary' => [
                'participants' => Participant::count(),
                'submissions' => Submission::where('status', 'completed')->count(),
                'draft_submissions' => Submission::where('status', 'draft')->count(),
                'pre_tests' => Submission::where('test_type', 'pre_test')->where('status', 'completed')->count(),
                'post_tests' => Submission::where('test_type', 'post_test')->where('status', 'completed')->count(),
            ],
        ]);
    }

    public function participants(Request $request): StreamedResponse
    {
        $filename = 'ldkd-participants-' . now()->format('Ymd-His') . '.csv';

        AuditLogger::record('export_participants', 'Participant', null, null, $request->query());

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
                'Jenis Kelamin',
                'Posisi',
                'Status',
                'Jumlah Submission',
            ]);

            Participant::with(['school', 'classroom', 'activity'])
                ->withCount('submissions')
                ->when($request->query('search'), function ($query, string $search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('full_name', 'like', "%{$search}%")
                            ->orWhere('participant_code', 'like', "%{$search}%");
                    });
                })
                ->when($request->query('activity_id'), fn ($query, $activityId) => $query->where('activity_id', $activityId))
                ->when($request->query('school_id'), fn ($query, $schoolId) => $query->where('school_id', $schoolId))
                ->when($request->query('role'), fn ($query, $role) => $query->where('role', $role))
                ->orderBy('full_name')
                ->chunk(200, function ($participants) use ($output) {
                    foreach ($participants as $participant) {
                        fputcsv($output, [
                            $participant->participant_code,
                            $participant->full_name,
                            $participant->role,
                            $participant->school?->name,
                            $participant->classroom?->name,
                            $participant->activity?->name,
                            $participant->gender,
                            $participant->position,
                            $participant->is_active ? 'active' : 'inactive',
                            $participant->submissions_count,
                        ]);
                    }
                });

            fclose($output);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
