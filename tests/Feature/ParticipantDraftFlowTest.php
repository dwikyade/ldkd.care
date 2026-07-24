<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\AnswerOption;
use App\Models\CategoryThreshold;
use App\Models\Question;
use App\Models\Submission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ParticipantDraftFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_participant_can_create_code_autosave_and_complete_pretest(): void
    {
        $activity = Activity::create([
            'name' => 'Tes Literasi Digital',
            'theme' => 'Literasi Digital',
            'description' => 'Kegiatan pengujian',
            'location' => 'Sekolah',
            'start_date' => today()->subDay(),
            'end_date' => today()->addDay(),
            'is_active' => true,
        ]);

        [$literacyOption, $securityOption] = $this->createQuestionnaireFixtures();

        $this->postJson(route('participant.code.check'), [
            'activity_id' => $activity->id,
            'suffix' => 'A7K9',
        ])->assertOk()
            ->assertJsonPath('available', true)
            ->assertJsonPath('code', 'LDKD-A7K9');

        $this->postJson(route('participant.register'), [
            'activity_id' => $activity->id,
            'suffix' => 'A7K9',
            'role' => 'student',
            'language' => 'id',
            'full_name' => 'Peserta Uji',
            'school_name' => 'SMA Uji',
            'class_name' => 'X-1',
            'gender' => 'male',
        ])->assertOk()
            ->assertJsonPath('success', true);

        $submission = Submission::with('participant')->firstOrFail();

        $this->assertSame('draft', $submission->status);
        $this->assertSame('LDKD-A7K9', $submission->participant->participant_code);

        $this->withSession($this->participantSession($submission))
            ->postJson(route('participant.questionnaire.answers', ['submission' => $submission->result_token]), [
                'question_id' => $literacyOption->question_id,
                'answer_option_id' => $literacyOption->id,
                'current_step' => 'digital_literacy',
            ])->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('submission_answers', [
            'submission_id' => $submission->id,
            'question_id' => $literacyOption->question_id,
            'answer_option_id' => $literacyOption->id,
        ]);

        $this->withSession($this->participantSession($submission->fresh()))
            ->postJson(route('participant.questionnaire.complete', ['submission' => $submission->result_token]), [
                'answers' => [
                    $literacyOption->question_id => $literacyOption->id,
                    $securityOption->question_id => $securityOption->id,
                ],
            ])->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'status' => 'completed',
            'digital_literacy_category' => 'high',
            'data_security_category' => 'high',
        ]);
    }

    private function createQuestionnaireFixtures(): array
    {
        foreach (['digital_literacy', 'data_security'] as $module) {
            CategoryThreshold::create([
                'module' => $module,
                'category' => 'high',
                'minimum_percentage' => 0,
                'maximum_percentage' => 100,
                'version' => 1,
                'is_active' => true,
            ]);
        }

        $literacyQuestion = Question::create([
            'module' => 'digital_literacy',
            'text_id' => 'Saya dapat memeriksa sumber informasi digital.',
            'text_en' => 'I can verify digital information sources.',
            'display_order' => 1,
            'is_active' => true,
        ]);

        $securityQuestion = Question::create([
            'module' => 'data_security',
            'text_id' => 'Saya menjaga kode OTP pribadi.',
            'text_en' => 'I keep OTP codes private.',
            'display_order' => 2,
            'is_active' => true,
        ]);

        return [
            AnswerOption::create([
                'question_id' => $literacyQuestion->id,
                'label_id' => 'Sangat Setuju',
                'label_en' => 'Strongly Agree',
                'weight' => 4,
                'display_order' => 1,
                'is_active' => true,
            ]),
            AnswerOption::create([
                'question_id' => $securityQuestion->id,
                'label_id' => 'Sangat Setuju',
                'label_en' => 'Strongly Agree',
                'weight' => 4,
                'display_order' => 1,
                'is_active' => true,
            ]),
        ];
    }

    private function participantSession(Submission $submission): array
    {
        return [
            'participant_session' => [
                'id' => $submission->participant_id,
                'test_type' => $submission->test_type,
                'activity_id' => $submission->activity_id,
                'language' => $submission->language,
                'submission_id' => $submission->id,
                'submission_token' => $submission->result_token,
            ],
        ];
    }
}
