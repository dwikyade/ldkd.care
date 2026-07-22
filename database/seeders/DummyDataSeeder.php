<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;
use App\Models\Activity;
use App\Models\Participant;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a dummy school
        $school = School::firstOrCreate(
            ['name' => 'SMKN 1 Jakarta'],
            ['address' => 'Jl. Pendidikan No. 1, Jakarta']
        );

        // Create a dummy activity
        $activity = Activity::firstOrCreate(
            ['name' => 'Sosialisasi Literasi Digital 2024'],
            [
                'start_date' => now()->subDay(),
                'end_date' => now()->addDays(7),
                'theme' => 'Uji coba pengisian kuesioner LDKD Care.',
                'is_active' => true,
            ]
        );

        // Create a dummy participant
        Participant::firstOrCreate(
            ['participant_code' => 'LDKD-TEST1'],
            [
                'activity_id' => $activity->id,
                'full_name' => 'Rizal Afandi',
                'role' => 'student',
                'school_id' => $school->id,
                'is_active' => true,
            ]
        );
    }
}
