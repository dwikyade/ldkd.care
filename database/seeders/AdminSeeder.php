<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@ldkdcare.id'],
            [
                'name' => 'Admin LDKD Care',
                'email' => 'admin@ldkdcare.id',
                'password' => Hash::make('ldkdcare2024!'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
