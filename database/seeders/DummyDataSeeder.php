<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Classroom;
use App\Models\Participant;
use App\Models\School;
use Illuminate\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $activity = Activity::updateOrCreate(
            ['name' => 'Edukasi Literasi Digital LDKD Care'],
            [
                'start_date' => now()->subDay()->toDateString(),
                'end_date' => now()->addDays(14)->toDateString(),
                'theme' => 'Pre-test dan post-test Literasi Digital serta Keamanan Digital.',
                'description' => 'Kegiatan contoh untuk menguji alur pengisian kuesioner LDKD Care.',
                'location' => 'Sekolah Mitra',
                'is_active' => true,
            ],
        );

        $schools = [
            [
                'name' => 'SMKN 1 Jakarta',
                'address' => 'Jl. Pendidikan No. 1, Jakarta',
                'classes' => ['X RPL 1', 'XI RPL 1'],
                'participants' => [
                    ['code' => 'LDKD-A7K92', 'name' => 'Rizal Afandi', 'email' => 'rizal.afandi@example.com', 'role' => 'student', 'class' => 'X RPL 1', 'gender' => 'male'],
                    ['code' => 'LDKD-B4N18', 'name' => 'Nadia Putri', 'email' => 'nadia.putri@example.com', 'role' => 'student', 'class' => 'XI RPL 1', 'gender' => 'female'],
                    ['code' => 'LDKD-GURU1', 'name' => 'Dewi Lestari', 'email' => 'dewi.lestari@example.com', 'role' => 'teacher', 'class' => null, 'position' => 'Guru BK'],
                ],
            ],
            [
                'name' => 'SMP Nusantara',
                'address' => 'Jl. Merdeka No. 8, Jakarta',
                'classes' => ['VIII A', 'IX B'],
                'participants' => [
                    ['code' => 'LDKD-C9P41', 'name' => 'Fahmi Ramadhan', 'email' => 'fahmi.ramadhan@example.com', 'role' => 'student', 'class' => 'VIII A', 'gender' => 'male'],
                    ['code' => 'LDKD-D2Q77', 'name' => 'Alya Maharani', 'email' => 'alya.maharani@example.com', 'role' => 'student', 'class' => 'IX B', 'gender' => 'female'],
                ],
            ],
        ];

        foreach ($schools as $schoolData) {
            $school = School::updateOrCreate(
                ['name' => $schoolData['name']],
                [
                    'address' => $schoolData['address'],
                    'is_active' => true,
                ],
            );

            $classes = collect($schoolData['classes'])->mapWithKeys(function (string $name) use ($school) {
                $classroom = Classroom::updateOrCreate(
                    [
                        'school_id' => $school->id,
                        'name' => $name,
                    ],
                    ['is_active' => true],
                );

                return [$name => $classroom];
            });

            foreach ($schoolData['participants'] as $participantData) {
                Participant::updateOrCreate(
                    [
                        'activity_id' => $activity->id,
                        'participant_code' => $participantData['code'],
                    ],
                    [
                        'full_name' => $participantData['name'],
                        'email' => $participantData['email'] ?? null,
                        'role' => $participantData['role'],
                        'school_id' => $school->id,
                        'class_id' => $participantData['class'] ? $classes[$participantData['class']]->id : null,
                        'gender' => $participantData['gender'] ?? null,
                        'position' => $participantData['position'] ?? null,
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
