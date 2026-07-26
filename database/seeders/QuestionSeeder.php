<?php

namespace Database\Seeders;

use App\Models\Competency;
use App\Models\CompetencyFramework;
use App\Models\Question;
use App\Models\QuestionnaireVersion;
use App\Models\ResponseScale;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $version = QuestionnaireVersion::updateOrCreate(
            ['code' => 'LDKD-KOMINFO-UNESCO-2026-V1'],
            [
                'name' => 'LDKD Care Instrumen Final v1',
                'description' => 'Instrumen adaptasi berbasis Indeks Literasi Digital Indonesia 2022 dan dipetakan menggunakan UNESCO Digital Literacy Global Framework.',
                'source_reference' => 'Indeks Literasi Digital Indonesia 2022; UNESCO Digital Literacy Global Framework.',
                'status' => 'active',
                'active_from' => now(),
                'active_until' => null,
            ],
        );

        QuestionnaireVersion::where('id', '!=', $version->id)->update(['status' => 'archived']);

        $scales = $this->seedResponseScales();
        $competencies = $this->seedCompetencies();

        Question::where(function ($query) use ($version) {
            $query->whereNull('questionnaire_version_id')
                ->orWhere('questionnaire_version_id', '!=', $version->id);
        })->update(['is_active' => false]);

        foreach ($this->questions() as $index => $item) {
            $question = Question::updateOrCreate(
                [
                    'questionnaire_version_id' => $version->id,
                    'display_order' => $index + 1,
                ],
                [
                    'module' => $item['module'],
                    'kominfo_pillar' => $item['pillar'],
                    'text_id' => $item['text_id'],
                    'text_en' => $item['text_en'],
                    'question_type' => 'self_assessment',
                    'response_scale_id' => $scales[$item['scale']]->id,
                    'assessment_type' => 'self_assessment',
                    'difficulty_level' => $item['difficulty'],
                    'proficiency_level' => $item['proficiency'],
                    'unesco_competence_code' => $item['unesco'],
                    'is_reverse' => false,
                    'included_in_score' => true,
                    'is_active' => true,
                ],
            );

            $this->syncOptions($question, $item['scale']);

            $competency = $competencies[$item['unesco']] ?? null;
            $question->competencies()->sync(
                $competency ? [$competency->id => ['mapping_type' => 'primary']] : [],
            );
        }
    }

    private function seedResponseScales(): array
    {
        $ability = ResponseScale::updateOrCreate(
            ['code' => 'ability_1_5'],
            [
                'name_id' => 'Skala Kemampuan 1-5',
                'name_en' => 'Ability Scale 1-5',
                'description_id' => 'Digunakan untuk Digital Skill dan Digital Safety.',
                'description_en' => 'Used for Digital Skill and Digital Safety.',
                'scale_type' => 'ability',
                'is_active' => true,
            ],
        );

        $agreement = ResponseScale::updateOrCreate(
            ['code' => 'agreement_1_5'],
            [
                'name_id' => 'Skala Persetujuan 1-5',
                'name_en' => 'Agreement Scale 1-5',
                'description_id' => 'Digunakan untuk Digital Ethics dan Digital Culture.',
                'description_en' => 'Used for Digital Ethics and Digital Culture.',
                'scale_type' => 'agreement',
                'is_active' => true,
            ],
        );

        return [
            'ability_1_5' => $ability,
            'agreement_1_5' => $agreement,
        ];
    }

    private function seedCompetencies(): array
    {
        $framework = CompetencyFramework::updateOrCreate(
            ['code' => 'UNESCO-DLGF'],
            [
                'name' => 'UNESCO Digital Literacy Global Framework',
                'description' => 'Kerangka pemetaan kompetensi digital yang digunakan sebagai rujukan pengembangan instrumen LDKD Care.',
                'source_reference' => 'UNESCO Digital Literacy Global Framework.',
            ],
        );

        $items = [
            '1.1' => 'Browsing, searching and filtering data, information and digital content',
            '1.2' => 'Evaluating data, information and digital content',
            '1.3' => 'Managing data, information and digital content',
            '2.1' => 'Interacting through digital technologies',
            '2.2' => 'Sharing through digital technologies',
            '2.5' => 'Netiquette',
            '2.6' => 'Managing digital identity',
            '3.1' => 'Developing digital content',
            '4.1' => 'Protecting devices',
            '4.2' => 'Protecting personal data and privacy',
            '4.3' => 'Protecting health and well-being',
            '5.2' => 'Identifying needs and technological responses',
        ];

        $competencies = [];

        foreach ($items as $code => $name) {
            $competencies[$code] = Competency::updateOrCreate(
                [
                    'framework' => 'UNESCO-DLGF',
                    'code' => $code,
                ],
                [
                    'competency_framework_id' => $framework->id,
                    'name' => $name,
                    'description' => null,
                    'parent_id' => null,
                ],
            );
        }

        return $competencies;
    }

    private function questions(): array
    {
        return [
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_skill',
                'scale' => 'ability_1_5',
                'unesco' => '1.1',
                'difficulty' => 'basic',
                'proficiency' => 'foundation',
                'text_id' => 'Saya dapat mencari informasi digital dengan kata kunci yang tepat sesuai kebutuhan belajar.',
                'text_en' => 'I can search for digital information using keywords that fit my learning needs.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_skill',
                'scale' => 'ability_1_5',
                'unesco' => '1.2',
                'difficulty' => 'basic',
                'proficiency' => 'foundation',
                'text_id' => 'Saya dapat membandingkan beberapa sumber digital sebelum percaya pada sebuah informasi.',
                'text_en' => 'I can compare several digital sources before trusting information.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_skill',
                'scale' => 'ability_1_5',
                'unesco' => '1.2',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya dapat membedakan fakta, opini, iklan, dan konten manipulatif dalam media digital.',
                'text_en' => 'I can distinguish facts, opinions, advertisements, and manipulative content in digital media.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_skill',
                'scale' => 'ability_1_5',
                'unesco' => '5.2',
                'difficulty' => 'basic',
                'proficiency' => 'foundation',
                'text_id' => 'Saya dapat menggunakan fitur dasar perangkat atau aplikasi belajar digital secara mandiri.',
                'text_en' => 'I can use basic features of digital learning devices or applications independently.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_skill',
                'scale' => 'ability_1_5',
                'unesco' => '1.3',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya dapat menyimpan, mengatur, dan menemukan kembali file atau tautan penting dengan rapi.',
                'text_en' => 'I can save, organize, and find important files or links neatly.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_ethics',
                'scale' => 'agreement_1_5',
                'unesco' => '3.1',
                'difficulty' => 'basic',
                'proficiency' => 'foundation',
                'text_id' => 'Saya meminta izin atau menyebutkan sumber saat menggunakan karya digital orang lain.',
                'text_en' => 'I ask permission or cite sources when using other people\'s digital work.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_ethics',
                'scale' => 'agreement_1_5',
                'unesco' => '2.5',
                'difficulty' => 'basic',
                'proficiency' => 'foundation',
                'text_id' => 'Saya berkomunikasi dengan sopan di ruang digital meskipun berbeda pendapat.',
                'text_en' => 'I communicate politely in digital spaces even when I disagree.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_ethics',
                'scale' => 'agreement_1_5',
                'unesco' => '2.2',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya mempertimbangkan dampak komentar atau unggahan sebelum mempublikasikannya.',
                'text_en' => 'I consider the impact of comments or posts before publishing them.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_ethics',
                'scale' => 'agreement_1_5',
                'unesco' => '4.3',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya tidak ikut menyebarkan konten yang dapat merendahkan, mempermalukan, atau merugikan orang lain.',
                'text_en' => 'I do not help spread content that may demean, embarrass, or harm others.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_ethics',
                'scale' => 'agreement_1_5',
                'unesco' => '2.6',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya menjaga identitas digital agar tidak merugikan diri sendiri maupun orang lain.',
                'text_en' => 'I manage my digital identity so it does not harm myself or others.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_culture',
                'scale' => 'agreement_1_5',
                'unesco' => '2.5',
                'difficulty' => 'basic',
                'proficiency' => 'foundation',
                'text_id' => 'Saya menghargai keberagaman budaya, bahasa, agama, dan kebiasaan saat berinteraksi di internet.',
                'text_en' => 'I respect differences in culture, language, religion, and habits when interacting online.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_culture',
                'scale' => 'agreement_1_5',
                'unesco' => '2.1',
                'difficulty' => 'basic',
                'proficiency' => 'foundation',
                'text_id' => 'Saya menggunakan ruang digital untuk mendukung kegiatan belajar, kolaborasi, dan partisipasi positif.',
                'text_en' => 'I use digital spaces to support learning, collaboration, and positive participation.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_culture',
                'scale' => 'agreement_1_5',
                'unesco' => '2.2',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya memeriksa konteks budaya atau lokal sebelum menanggapi konten yang berpotensi memicu konflik.',
                'text_en' => 'I check cultural or local context before responding to content that may trigger conflict.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_culture',
                'scale' => 'agreement_1_5',
                'unesco' => '3.1',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya menggunakan bahasa yang inklusif dan tidak diskriminatif saat membuat atau membagikan konten.',
                'text_en' => 'I use inclusive and non-discriminatory language when creating or sharing content.',
            ],
            [
                'module' => 'digital_literacy',
                'pillar' => 'digital_culture',
                'scale' => 'agreement_1_5',
                'unesco' => '2.1',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya bersedia membantu teman atau keluarga menggunakan teknologi secara lebih bijak.',
                'text_en' => 'I am willing to help friends or family use technology more wisely.',
            ],
            [
                'module' => 'data_security',
                'pillar' => 'digital_safety',
                'scale' => 'ability_1_5',
                'unesco' => '4.1',
                'difficulty' => 'basic',
                'proficiency' => 'foundation',
                'text_id' => 'Saya dapat membuat kata sandi kuat dan berbeda untuk akun penting.',
                'text_en' => 'I can create strong and different passwords for important accounts.',
            ],
            [
                'module' => 'data_security',
                'pillar' => 'digital_safety',
                'scale' => 'ability_1_5',
                'unesco' => '4.2',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya dapat mengenali tanda phishing seperti tautan mencurigakan, permintaan OTP, atau hadiah palsu.',
                'text_en' => 'I can recognize phishing signs such as suspicious links, OTP requests, or fake prizes.',
            ],
            [
                'module' => 'data_security',
                'pillar' => 'digital_safety',
                'scale' => 'ability_1_5',
                'unesco' => '4.2',
                'difficulty' => 'basic',
                'proficiency' => 'foundation',
                'text_id' => 'Saya dapat mengatur privasi akun dan membatasi data pribadi yang dibagikan.',
                'text_en' => 'I can manage account privacy and limit the personal data I share.',
            ],
            [
                'module' => 'data_security',
                'pillar' => 'digital_safety',
                'scale' => 'ability_1_5',
                'unesco' => '4.1',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya dapat memeriksa izin aplikasi sebelum memasang atau menggunakannya.',
                'text_en' => 'I can check app permissions before installing or using an application.',
            ],
            [
                'module' => 'data_security',
                'pillar' => 'digital_safety',
                'scale' => 'ability_1_5',
                'unesco' => '4.2',
                'difficulty' => 'intermediate',
                'proficiency' => 'intermediate',
                'text_id' => 'Saya dapat melakukan langkah awal saat akun terindikasi diretas, seperti mengganti kata sandi dan melaporkan aktivitas mencurigakan.',
                'text_en' => 'I can take initial steps when an account may be hacked, such as changing passwords and reporting suspicious activity.',
            ],
        ];
    }

    private function syncOptions(Question $question, string $scale): void
    {
        $options = $scale === 'ability_1_5'
            ? [
                ['label_id' => 'Tidak mengerti', 'label_en' => 'I do not understand', 'weight' => 1],
                ['label_id' => 'Tidak pernah melakukan', 'label_en' => 'I have never done this', 'weight' => 2],
                ['label_id' => 'Melakukan dengan bantuan', 'label_en' => 'I can do this with help', 'weight' => 3],
                ['label_id' => 'Melakukan sendiri', 'label_en' => 'I can do this independently', 'weight' => 4],
                ['label_id' => 'Melakukan sendiri dan membantu orang lain', 'label_en' => 'I can do this independently and help others', 'weight' => 5],
            ]
            : [
                ['label_id' => 'Sangat Tidak Setuju', 'label_en' => 'Strongly Disagree', 'weight' => 1],
                ['label_id' => 'Tidak Setuju', 'label_en' => 'Disagree', 'weight' => 2],
                ['label_id' => 'Ragu-ragu', 'label_en' => 'Unsure', 'weight' => 3],
                ['label_id' => 'Setuju', 'label_en' => 'Agree', 'weight' => 4],
                ['label_id' => 'Sangat Setuju', 'label_en' => 'Strongly Agree', 'weight' => 5],
            ];

        foreach ($options as $index => $option) {
            $question->answerOptions()->updateOrCreate(
                ['display_order' => $index + 1],
                [
                    'label_id' => $option['label_id'],
                    'label_en' => $option['label_en'],
                    'weight' => $option['weight'],
                    'is_active' => true,
                ],
            );
        }

        $question->answerOptions()
            ->where('display_order', '>', count($options))
            ->update(['is_active' => false]);
    }
}
