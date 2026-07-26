<?php

namespace Database\Seeders;

use App\Models\CategoryThreshold;
use Illuminate\Database\Seeder;

class CategoryThresholdSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            'digital_literacy',
            'data_security',
            'digital_skill',
            'digital_ethics',
            'digital_safety',
            'digital_culture',
            'total_index',
        ];
        
        $thresholds = [
            ['category' => 'low', 'minimum_percentage' => 1, 'maximum_percentage' => 2.33],
            ['category' => 'medium', 'minimum_percentage' => 2.34, 'maximum_percentage' => 3.66],
            ['category' => 'high', 'minimum_percentage' => 3.67, 'maximum_percentage' => 5],
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
