<?php

namespace App\Services;

use App\Models\Participant;
use Illuminate\Support\Collection;

class DuplicateDetectionService
{
    /**
     * Detect potential duplicate participants within an activity based on similarities.
     */
    public function detect(int $activityId): Collection
    {
        // A simple detection logic: find participants with the exact same name, school, and role
        // in the same activity. Advanced implementations could use Levenshtein distance for names.
        
        $duplicates = Participant::selectRaw('MIN(id) as primary_id, full_name, school_id, role, COUNT(*) as count')
            ->where('activity_id', $activityId)
            ->where('is_active', true)
            ->whereNull('merged_into_id')
            ->groupBy('full_name', 'school_id', 'role')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        $result = collect();

        foreach ($duplicates as $duplicate) {
            $related = Participant::where('activity_id', $activityId)
                ->where('full_name', $duplicate->full_name)
                ->where('school_id', $duplicate->school_id)
                ->where('role', $duplicate->role)
                ->where('is_active', true)
                ->whereNull('merged_into_id')
                ->get();
                
            $result->push([
                'group_criteria' => [
                    'name' => $duplicate->full_name,
                    'role' => $duplicate->role,
                ],
                'participants' => $related,
            ]);
        }

        return $result;
    }
}
