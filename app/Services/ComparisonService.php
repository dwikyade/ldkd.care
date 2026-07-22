<?php

namespace App\Services;

use App\Models\Participant;
use App\Models\Submission;

class ComparisonService
{
    /**
     * Compare pre-test and post-test results for a specific participant.
     */
    public function compareParticipant(int $participantId): array
    {
        $preTest = Submission::where('participant_id', $participantId)
            ->where('test_type', 'pre_test')
            ->first();

        $postTest = Submission::where('participant_id', $participantId)
            ->where('test_type', 'post_test')
            ->first();

        $result = [
            'pre_test' => $preTest,
            'post_test' => $postTest,
            'digital_literacy_diff' => null,
            'data_security_diff' => null,
            'status' => 'incomplete',
        ];

        if ($preTest && $postTest) {
            $result['status'] = 'complete';
            $result['digital_literacy_diff'] = $postTest->digital_literacy_score - $preTest->digital_literacy_score;
            $result['data_security_diff'] = $postTest->data_security_score - $preTest->data_security_score;
        }

        return $result;
    }
}
