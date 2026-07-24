<?php

namespace App\Services;

use App\Models\Participant;
use Illuminate\Support\Str;

class ParticipantCodeService
{
    public function normalizeSuffix(string $suffix): string
    {
        return strtoupper(trim($suffix));
    }

    public function makeCode(string $suffix): string
    {
        return 'LDKD-' . $this->normalizeSuffix($suffix);
    }

    public function extractSuffix(string $codeOrSuffix): string
    {
        $normalized = strtoupper(trim($codeOrSuffix));

        return str_starts_with($normalized, 'LDKD-')
            ? substr($normalized, 5)
            : $normalized;
    }

    public function isValidSuffix(string $suffix): bool
    {
        return preg_match('/^[A-Z0-9]{4,5}$/', $this->normalizeSuffix($suffix)) === 1;
    }

    public function isAvailable(int $activityId, string $suffix): bool
    {
        $code = $this->makeCode($suffix);

        return ! Participant::where('activity_id', $activityId)
            ->whereRaw('UPPER(participant_code) = ?', [$code])
            ->exists();
    }

    public function generateSuffix(int $length = 5): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $suffix = '';

        for ($i = 0; $i < $length; $i++) {
            $suffix .= $alphabet[random_int(0, strlen($alphabet) - 1)];
        }

        return $suffix;
    }

    public function generateUniqueSuffix(int $activityId): string
    {
        do {
            $suffix = $this->generateSuffix(random_int(4, 5));
        } while (! $this->isAvailable($activityId, $suffix));

        return $suffix;
    }

    /**
     * Generate a unique participant code for admin-created participants.
     */
    public function generateUniqueCode(int $activityId): string
    {
        return $this->makeCode($this->generateUniqueSuffix($activityId));
    }
}
