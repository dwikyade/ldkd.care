<?php

namespace App\Services;

use App\Models\Participant;
use App\Models\Submission;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Exception;

class ParticipantMergeService
{
    /**
     * Merge a source participant into a target participant.
     */
    public function merge(int $sourceId, int $targetId, ?int $adminId = null): bool
    {
        if ($sourceId === $targetId) {
            throw new Exception("Source and target participants cannot be the same.");
        }

        $source = Participant::findOrFail($sourceId);
        $target = Participant::findOrFail($targetId);

        if ($source->activity_id !== $target->activity_id) {
            throw new Exception("Participants must belong to the same activity to be merged.");
        }

        DB::beginTransaction();
        try {
            // Check for submission conflicts
            $sourceTests = Submission::where('participant_id', $sourceId)->pluck('test_type')->toArray();
            $targetTests = Submission::where('participant_id', $targetId)->pluck('test_type')->toArray();

            $intersect = array_intersect($sourceTests, $targetTests);
            if (count($intersect) > 0) {
                throw new Exception("Conflict detected: Both participants have completed the following test types: " . implode(', ', $intersect));
            }

            // Move submissions
            Submission::where('participant_id', $sourceId)->update(['participant_id' => $targetId]);

            // Mark source as merged
            $source->update([
                'is_active' => false,
                'merged_into_id' => $targetId,
            ]);

            // Log action
            AuditLog::create([
                'user_id' => $adminId,
                'action' => 'merge_participant',
                'entity_type' => 'Participant',
                'entity_id' => $targetId,
                'old_value' => ['source_participant_id' => $sourceId],
                'new_value' => ['target_participant_id' => $targetId],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
