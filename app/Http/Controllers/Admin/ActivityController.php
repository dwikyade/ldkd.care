<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ActivityController extends Controller
{
    public function index(): Response
    {
        $activities = Activity::withCount(['participants', 'submissions'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Activities/Index', [
            'activities' => $activities,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Activities/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'theme' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $activity = Activity::create($validated);
        AuditLogger::record('create_activity', $activity, null, null, $activity->toArray());

        return redirect()->route('admin.activities.index')->with('success', 'Kegiatan berhasil ditambahkan.');
    }

    public function edit(Activity $activity): Response
    {
        return Inertia::render('Admin/Activities/Form', [
            'activity' => $activity,
        ]);
    }

    public function update(Request $request, Activity $activity): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'theme' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $oldValue = $activity->toArray();
        $activity->update($validated);
        AuditLogger::record('update_activity', $activity, null, $oldValue, $activity->fresh()->toArray());

        return redirect()->route('admin.activities.index')->with('success', 'Kegiatan berhasil diperbarui.');
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        // Simple delete for now. In production, check related constraints first.
        if ($activity->participants()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus kegiatan yang sudah memiliki peserta.');
        }

        $oldValue = $activity->toArray();
        $activity->delete();
        AuditLogger::record('delete_activity', 'Activity', $activity->id, $oldValue);

        return redirect()->route('admin.activities.index')->with('success', 'Kegiatan berhasil dihapus.');
    }
}
