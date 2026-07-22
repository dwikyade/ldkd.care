<?php

namespace App\Services;

use App\Models\Participant;
use Illuminate\Support\Str;

class ParticipantCodeService
{
    /**
     * Generate a unique participant code for a given activity.
     */
    public function generateUniqueCode(int $activityId): string
    {
        do {
            $code = 'LDKD-' . strtoupper(Str::random(5));
        } while (Participant::where('activity_id', $activityId)->where('participant_code', $code)->exists());

        return $code;
    }
}
