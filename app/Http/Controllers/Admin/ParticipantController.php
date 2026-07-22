<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Classroom;
use App\Models\Participant;
use App\Models\School;
use App\Services\AuditLogger;
use App\Services\ParticipantCodeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function __construct(private ParticipantCodeService $codeService)
    {
    }

    public function index(Request $request): Response
    {
        $participants = Participant::with(['activity:id,name', 'school:id,name', 'classroom:id,name'])
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
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Participants/Index', [
            'participants' => $participants,
            'filters' => $request->only(['search', 'activity_id', 'school_id', 'role']),
            'activities' => Activity::orderBy('name')->get(['id', 'name']),
            'schools' => School::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Participants/Form', $this->formOptions());
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateParticipant($request);

        if (blank($validated['participant_code'] ?? null)) {
            $validated['participant_code'] = $this->codeService->generateUniqueCode((int) $validated['activity_id']);
        }

        $participant = Participant::create($validated);
        AuditLogger::record('create_participant', $participant, null, null, $participant->toArray());

        return redirect()->route('admin.participants.index')
            ->with('success', 'Peserta berhasil ditambahkan.');
    }

    public function edit(Participant $participant): Response
    {
        $participant->load(['activity:id,name', 'school:id,name', 'classroom:id,name']);

        return Inertia::render('Admin/Participants/Form', [
            ...$this->formOptions(),
            'participant' => $participant,
        ]);
    }

    public function update(Request $request, Participant $participant): RedirectResponse
    {
        $validated = $this->validateParticipant($request, $participant);
        $oldValue = $participant->toArray();
        $participant->update($validated);
        AuditLogger::record('update_participant', $participant, null, $oldValue, $participant->fresh()->toArray());

        return redirect()->route('admin.participants.index')
            ->with('success', 'Peserta berhasil diperbarui.');
    }

    public function destroy(Participant $participant): RedirectResponse
    {
        $oldValue = $participant->toArray();
        $participant->delete();
        AuditLogger::record('delete_participant', 'Participant', $participant->id, $oldValue);

        return redirect()->route('admin.participants.index')
            ->with('success', 'Peserta berhasil dihapus.');
    }

    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
            'school_id' => ['required', 'integer', 'exists:schools,id'],
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $handle = fopen($request->file('file')->getRealPath(), 'r');
        $headers = fgetcsv($handle);

        if (! $headers) {
            return back()->with('error', 'File CSV kosong atau tidak dapat dibaca.');
        }

        $headers = array_map(fn ($header) => strtolower(trim((string) $header)), $headers);
        $created = 0;
        $skipped = 0;

        DB::transaction(function () use ($handle, $headers, $validated, &$created, &$skipped) {
            while (($row = fgetcsv($handle)) !== false) {
                $data = array_combine($headers, array_pad($row, count($headers), null));
                $fullName = trim((string) ($data['full_name'] ?? $data['nama'] ?? ''));
                $role = trim((string) ($data['role'] ?? $data['peran'] ?? 'student'));

                if ($fullName === '' || ! in_array($role, ['student', 'teacher'], true)) {
                    $skipped++;
                    continue;
                }

                $classId = null;
                $className = trim((string) ($data['class'] ?? $data['kelas'] ?? ''));

                if ($className !== '') {
                    $classId = Classroom::firstOrCreate([
                        'school_id' => $validated['school_id'],
                        'name' => $className,
                    ])->id;
                }

                $code = strtoupper(trim((string) ($data['participant_code'] ?? $data['kode'] ?? '')));
                $code = $code !== '' ? $code : $this->codeService->generateUniqueCode((int) $validated['activity_id']);

                $exists = Participant::where('activity_id', $validated['activity_id'])
                    ->where('participant_code', $code)
                    ->exists();

                if ($exists) {
                    $skipped++;
                    continue;
                }

                Participant::create([
                    'activity_id' => $validated['activity_id'],
                    'participant_code' => $code,
                    'full_name' => $fullName,
                    'role' => $role,
                    'school_id' => $validated['school_id'],
                    'class_id' => $classId,
                    'gender' => $data['gender'] ?? $data['jenis_kelamin'] ?? null,
                    'position' => $data['position'] ?? $data['jabatan'] ?? null,
                    'is_active' => true,
                ]);

                $created++;
            }
        });

        fclose($handle);

        AuditLogger::record('import_participants', 'Participant', null, null, [
            'created' => $created,
            'skipped' => $skipped,
            'activity_id' => $validated['activity_id'],
            'school_id' => $validated['school_id'],
        ]);

        return redirect()->route('admin.participants.index')
            ->with('success', "{$created} peserta berhasil diimpor. {$skipped} baris dilewati.");
    }

    private function formOptions(): array
    {
        return [
            'activities' => Activity::orderBy('name')->get(['id', 'name']),
            'schools' => School::with(['classes' => fn ($query) => $query->orderBy('name')])
                ->orderBy('name')
                ->get(['id', 'name']),
        ];
    }

    private function validateParticipant(Request $request, ?Participant $participant = null): array
    {
        return $request->validate([
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
            'participant_code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('participants', 'participant_code')
                    ->where(fn ($query) => $query->where('activity_id', $request->integer('activity_id')))
                    ->ignore($participant?->id),
            ],
            'full_name' => ['required', 'string', 'max:191'],
            'role' => ['required', 'string', 'in:student,teacher'],
            'school_id' => ['required', 'integer', 'exists:schools,id'],
            'class_id' => ['nullable', 'integer', 'exists:classes,id'],
            'gender' => ['nullable', 'string', 'max:20'],
            'position' => ['nullable', 'string', 'max:150'],
            'is_active' => ['boolean'],
        ]);
    }
}
