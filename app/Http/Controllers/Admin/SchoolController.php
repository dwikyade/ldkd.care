<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SchoolController extends Controller
{
    public function index(): Response
    {
        $schools = School::withCount(['participants', 'classes'])
            ->orderBy('name', 'asc')
            ->paginate(10);

        return Inertia::render('Admin/Schools/Index', [
            'schools' => $schools,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Schools/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $school = School::create($validated);

        AuditLogger::record('create_school', $school, null, null, $school->toArray());

        return redirect()->route('admin.schools.index')->with('success', 'Data sekolah berhasil ditambahkan.');
    }

    public function edit(School $school): Response
    {
        $school->load(['classes' => fn ($query) => $query->withCount('participants')->orderBy('name')]);

        return Inertia::render('Admin/Schools/Form', [
            'school' => $school,
        ]);
    }

    public function update(Request $request, School $school): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $oldValue = $school->toArray();
        $school->update($validated);

        AuditLogger::record('update_school', $school, null, $oldValue, $school->fresh()->toArray());

        return redirect()->route('admin.schools.index')->with('success', 'Data sekolah berhasil diperbarui.');
    }

    public function destroy(School $school): RedirectResponse
    {
        if ($school->participants()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus sekolah yang sudah memiliki peserta terdaftar.');
        }

        $oldValue = $school->toArray();
        $school->delete();

        AuditLogger::record('delete_school', 'School', $school->id, $oldValue);

        return redirect()->route('admin.schools.index')->with('success', 'Data sekolah berhasil dihapus.');
    }
}
