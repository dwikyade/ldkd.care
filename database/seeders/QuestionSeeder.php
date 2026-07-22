<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        // Sample questions for Digital Literacy
        $q1 = Question::create([
            'module' => 'digital_literacy',
            'text_id' => 'Saya selalu memverifikasi kebenaran informasi sebelum membagikannya di media sosial.',
            'text_en' => 'I always verify the truthfulness of information before sharing it on social media.',
            'display_order' => 1,
        ]);
        
        $this->addOptions($q1);

        $q2 = Question::create([
            'module' => 'digital_literacy',
            'text_id' => 'Saya tahu cara mengenali berita palsu (hoaks) di internet.',
            'text_en' => 'I know how to recognize fake news (hoaxes) on the internet.',
            'display_order' => 2,
        ]);
        
        $this->addOptions($q2);

        // Sample questions for Data Security
        $q3 = Question::create([
            'module' => 'data_security',
            'text_id' => 'Saya menggunakan kombinasi huruf, angka, dan simbol untuk kata sandi saya.',
            'text_en' => 'I use a combination of letters, numbers, and symbols for my passwords.',
            'display_order' => 1,
        ]);

        $this->addOptions($q3);

        $q4 = Question::create([
            'module' => 'data_security',
            'text_id' => 'Saya tidak pernah membagikan kode OTP (One Time Password) kepada siapapun.',
            'text_en' => 'I never share OTP (One Time Password) codes with anyone.',
            'display_order' => 2,
        ]);

        $this->addOptions($q4);
    }

    private function addOptions(Question $question): void
    {
        $options = [
            ['label_id' => 'Sangat Tidak Setuju', 'label_en' => 'Strongly Disagree', 'weight' => 1],
            ['label_id' => 'Tidak Setuju', 'label_en' => 'Disagree', 'weight' => 2],
            ['label_id' => 'Setuju', 'label_en' => 'Agree', 'weight' => 3],
            ['label_id' => 'Sangat Setuju', 'label_en' => 'Strongly Agree', 'weight' => 4],
        ];

        $order = 1;
        foreach ($options as $opt) {
            $question->answerOptions()->create([
                'label_id' => $opt['label_id'],
                'label_en' => $opt['label_en'],
                'weight' => $opt['weight'],
                'display_order' => $order++,
            ]);
        }
    }
}
