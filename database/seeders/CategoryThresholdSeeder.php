<?php

namespace Database\Seeders;

use App\Models\CategoryThreshold;
use Illuminate\Database\Seeder;

class CategoryThresholdSeeder extends Seeder
{
    public function run(): void
    {
        $modules = ['digital_literacy', 'data_security'];
        
        foreach ($modules as $module) {
            CategoryThreshold::insert([
                [
                    'module' => $module,
                    'category' => 'low',
                    'minimum_percentage' => 0,
                    'maximum_percentage' => 49.99,
                    'version' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'module' => $module,
                    'category' => 'medium',
                    'minimum_percentage' => 50,
                    'maximum_percentage' => 74.99,
                    'version' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'module' => $module,
                    'category' => 'high',
                    'minimum_percentage' => 75,
                    'maximum_percentage' => 100,
                    'version' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
