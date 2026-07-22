<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Participant\IdentifyRequest;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function identify(Request $request): Response
    {
        return Inertia::render('Participant/Identify', [
            'mode' => $request->query('mode'),
            'role' => $request->query('role'),
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

        // Check if already submitted
        $alreadySubmitted = $participant->submissions()
            ->where('test_type', $request->test_type)
            ->exists();

        if ($alreadySubmitted) {
            return back()->withErrors(['participant_code' => 'Anda sudah mengisi kuesioner ini sebelumnya.']);
        }

        // Store confirmed participant in session for the next steps
        session([
            'participant_session' => [
                'id' => $participant->id,
                'test_type' => $request->test_type,
                'activity_id' => $request->activity_id,
            ]
        ]);

        return Inertia::render('Participant/ConfirmIdentity', [
            'participant' => $participant,
            'test_type' => $request->test_type,
        ]);
    }
}
