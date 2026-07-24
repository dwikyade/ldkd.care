<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Participant\IdentifyRequest;
use App\Models\Activity;
use App\Models\Participant;
use App\Models\School;
use App\Services\QuestionnaireDraftService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function __construct(private QuestionnaireDraftService $draftService)
    {
    }

    public function identify(Request $request): Response
    {
        $language = in_array($request->query('lang'), ['id', 'en'], true)
            ? $request->query('lang')
            : 'id';

        $activity = Activity::where('is_active', true)
            ->whereDate('start_date', '<=', today())
            ->whereDate('end_date', '>=', today())
            ->latest('start_date')
            ->first();

        return Inertia::render('Participant/Identify', [
            'mode' => $request->query('mode', 'pre_test'),
            'role' => $request->query('role', 'student'),
            'language' => $language,
            'activity' => $activity,
            'schools' => School::with(['classes' => fn ($query) => $query->where('is_active', true)->orderBy('name')])
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function verify(IdentifyRequest $request): RedirectResponse|Response
    {
        $participant = Participant::with(['school', 'classroom'])
            ->where('activity_id', $request->activity_id)
            ->where('participant_code', $request->participant_code)
            ->where('role', $request->role)
            ->where('is_active', true)
            ->whereNull('merged_into_id')
            ->first();

        if (!$participant) {
            return back()->withErrors(['participant_code' => 'Kode peserta tidak ditemukan atau tidak valid untuk peran ini.']);
        }

        $alreadySubmitted = $participant->submissions()
            ->where('test_type', $request->test_type)
            ->where('status', 'completed')
            ->exists();

        if ($alreadySubmitted) {
            return back()->withErrors(['participant_code' => 'Anda sudah mengisi kuesioner ini sebelumnya.']);
        }

        $submission = $this->draftService->createDraft(
            $participant,
            $request->test_type,
            $request->input('language', 'id'),
        );

        session([
            'participant_session' => [
                'id' => $participant->id,
                'test_type' => $request->test_type,
                'activity_id' => $request->activity_id,
                'language' => $request->input('language', 'id'),
                'submission_id' => $submission->id,
                'submission_token' => $submission->result_token,
            ]
        ]);

        return Inertia::render('Participant/ConfirmIdentity', [
            'participant' => $participant,
            'test_type' => $request->test_type,
            'language' => $request->input('language', 'id'),
        ]);
    }
}
