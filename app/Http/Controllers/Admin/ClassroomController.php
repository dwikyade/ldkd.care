<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\School;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function store(Request $request, School $school): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'is_active' => ['boolean'],
        ]);

        $classroom = $school->classes()->create([
            'name' => $validated['name'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        AuditLogger::record('create_classroom', $classroom, null, null, $classroom->toArray());

        return redirect()->route('admin.schools.edit', $school)
            ->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, School $school, Classroom $classroom): RedirectResponse
    {
        abort_unless((int) $classroom->school_id === (int) $school->id, 404);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'is_active' => ['boolean'],
        ]);

        $oldValue = $classroom->toArray();
        $classroom->update([
            'name' => $validated['name'],
            'is_active' => $validated['is_active'] ?? false,
        ]);

        AuditLogger::record('update_classroom', $classroom, null, $oldValue, $classroom->fresh()->toArray());

        return redirect()->route('admin.schools.edit', $school)
            ->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(School $school, Classroom $classroom): RedirectResponse
    {
        abort_unless((int) $classroom->school_id === (int) $school->id, 404);

        if ($classroom->participants()->exists()) {
            return redirect()->route('admin.schools.edit', $school)
                ->with('error', 'Kelas yang sudah memiliki peserta tidak dapat dihapus. Nonaktifkan kelas jika tidak digunakan.');
        }

        $oldValue = $classroom->toArray();
        $classroom->delete();

        AuditLogger::record('delete_classroom', 'Classroom', $classroom->id, $oldValue);

        return redirect()->route('admin.schools.edit', $school)
            ->with('success', 'Kelas berhasil dihapus.');
    }
}
