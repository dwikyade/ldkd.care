<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(): Response
    {
        // Get the current active activity (assuming one active at a time for the landing)
        $activity = Activity::where('is_active', true)
            ->whereDate('start_date', '<=', today())
            ->whereDate('end_date', '>=', today())
            ->first();

        return Inertia::render('Participant/Landing', [
            'activity' => $activity,
        ]);
    }

    public function selectMode(): Response
    {
        return Inertia::render('Participant/SelectMode');
    }

    public function selectRole(): Response
    {
        return Inertia::render('Participant/SelectRole');
    }
}
