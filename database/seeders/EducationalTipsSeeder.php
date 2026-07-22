<?php

namespace Database\Seeders;

use App\Models\EducationalTip;
use Illuminate\Database\Seeder;

class EducationalTipsSeeder extends Seeder
{
    public function run(): void
    {
        $tips = [
            // Digital Literacy
            [
                'module' => 'digital_literacy',
                'category' => 'low',
                'content_id' => 'Pelajari cara memverifikasi sumber sebelum membagikan informasi.',
                'content_en' => 'Learn how to verify sources before sharing information.',
            ],
            [
                'module' => 'digital_literacy',
                'category' => 'medium',
                'content_id' => 'Tingkatkan kemampuan membedakan fakta, opini, dan informasi menyesatkan.',
                'content_en' => 'Improve your ability to distinguish facts, opinions, and misleading information.',
            ],
            [
                'module' => 'digital_literacy',
                'category' => 'high',
                'content_id' => 'Pertahankan kebiasaan memeriksa sumber dan bantu mengedukasi orang lain.',
                'content_en' => 'Maintain the habit of checking sources and help educate others.',
            ],
            // Data Security
            [
                'module' => 'data_security',
                'category' => 'low',
                'content_id' => 'Gunakan kata sandi kuat dan jangan membagikan OTP.',
                'content_en' => 'Use strong passwords and do not share your OTP.',
            ],
            [
                'module' => 'data_security',
                'category' => 'medium',
                'content_id' => 'Aktifkan autentikasi dua faktor dan periksa izin aplikasi.',
                'content_en' => 'Enable two-factor authentication and check app permissions.',
            ],
            [
                'module' => 'data_security',
                'category' => 'high',
                'content_id' => 'Lakukan pemeriksaan keamanan akun secara berkala.',
                'content_en' => 'Conduct regular security checks on your accounts.',
            ],
        ];

        foreach ($tips as $tip) {
            EducationalTip::create($tip);
        }
    }
}
