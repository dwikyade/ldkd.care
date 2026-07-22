<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            'digital_literacy' => [
                'Saya selalu memverifikasi kebenaran informasi sebelum membagikannya di media sosial.',
                'Saya tahu cara mengenali berita palsu atau hoaks di internet.',
                'Saya membandingkan informasi dari beberapa sumber sebelum mengambil kesimpulan.',
                'Saya dapat membedakan fakta, opini, dan iklan dalam konten digital.',
                'Saya menggunakan teknologi digital secara bertanggung jawab dan menghargai orang lain.',
            ],
            'data_security' => [
                'Saya menggunakan kombinasi huruf, angka, dan simbol untuk kata sandi saya.',
                'Saya tidak pernah membagikan kode OTP kepada siapa pun.',
                'Saya mengenali tanda-tanda tautan phishing atau penipuan digital.',
                'Saya memeriksa izin aplikasi sebelum memasang atau menggunakannya.',
                'Saya mengaktifkan pengamanan tambahan seperti PIN, biometrik, atau autentikasi dua faktor.',
            ],
        ];

        $translations = [
            'I always verify information before sharing it on social media.',
            'I know how to recognize fake news or hoaxes on the internet.',
            'I compare information from multiple sources before drawing conclusions.',
            'I can distinguish facts, opinions, and advertisements in digital content.',
            'I use digital technology responsibly and respect others.',
            'I use a combination of letters, numbers, and symbols for my passwords.',
            'I never share OTP codes with anyone.',
            'I recognize signs of phishing links or digital scams.',
            'I check app permissions before installing or using them.',
            'I enable extra protection such as PIN, biometrics, or two-factor authentication.',
        ];

        $translationIndex = 0;

        foreach ($questions as $module => $items) {
            foreach ($items as $index => $text) {
                $question = Question::updateOrCreate(
                    [
                        'module' => $module,
                        'display_order' => $index + 1,
                    ],
                    [
                        'text_id' => $text,
                        'text_en' => $translations[$translationIndex],
                        'is_active' => true,
                    ],
                );

                $this->syncOptions($question);
                $translationIndex++;
            }
        }
    }

    private function syncOptions(Question $question): void
    {
        $options = [
            ['label_id' => 'Sangat Tidak Setuju', 'label_en' => 'Strongly Disagree', 'weight' => 1],
            ['label_id' => 'Tidak Setuju', 'label_en' => 'Disagree', 'weight' => 2],
            ['label_id' => 'Setuju', 'label_en' => 'Agree', 'weight' => 3],
            ['label_id' => 'Sangat Setuju', 'label_en' => 'Strongly Agree', 'weight' => 4],
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
    }
}
