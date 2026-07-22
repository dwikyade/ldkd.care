<?php

namespace Database\Seeders;

use App\Models\CategoryThreshold;
use Illuminate\Database\Seeder;

class CategoryThresholdSeeder extends Seeder
{
    public function run(): void
    {
        $modules = ['digital_literacy', 'data_security'];
        
        $thresholds = [
            ['category' => 'low', 'minimum_percentage' => 0, 'maximum_percentage' => 49.99],
            ['category' => 'medium', 'minimum_percentage' => 50, 'maximum_percentage' => 74.99],
            ['category' => 'high', 'minimum_percentage' => 75, 'maximum_percentage' => 100],
        ];

        foreach ($modules as $module) {
            foreach ($thresholds as $threshold) {
                CategoryThreshold::updateOrCreate(
                    [
                        'module' => $module,
                        'category' => $threshold['category'],
                        'version' => 1,
                    ],
                    [
                        'minimum_percentage' => $threshold['minimum_percentage'],
                        'maximum_percentage' => $threshold['maximum_percentage'],
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
