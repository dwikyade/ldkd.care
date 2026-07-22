<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CategoryThreshold;
use App\Models\EducationalTip;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ScoringSettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Scoring/Index', [
            'modules' => $this->modules(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'thresholds' => ['required', 'array'],
            'thresholds.*.id' => ['required', 'integer', 'exists:category_thresholds,id'],
            'thresholds.*.minimum_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'thresholds.*.maximum_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'thresholds.*.is_active' => ['boolean'],
            'tips' => ['required', 'array'],
            'tips.*.id' => ['required', 'integer', 'exists:educational_tips,id'],
            'tips.*.content_id' => ['required', 'string'],
            'tips.*.content_en' => ['nullable', 'string'],
            'tips.*.is_active' => ['boolean'],
        ]);

        foreach ($validated['thresholds'] as $threshold) {
            if ((float) $threshold['minimum_percentage'] > (float) $threshold['maximum_percentage']) {
                throw ValidationException::withMessages([
                    'thresholds' => 'Nilai minimum kategori tidak boleh lebih besar dari nilai maksimum.',
                ]);
            }
        }

        $oldValue = [
            'thresholds' => CategoryThreshold::orderBy('module')->orderBy('minimum_percentage')->get()->toArray(),
            'tips' => EducationalTip::orderBy('module')->orderBy('category')->get()->toArray(),
        ];

        DB::transaction(function () use ($validated) {
            foreach ($validated['thresholds'] as $row) {
                CategoryThreshold::whereKey($row['id'])->update([
                    'minimum_percentage' => $row['minimum_percentage'],
                    'maximum_percentage' => $row['maximum_percentage'],
                    'is_active' => $row['is_active'] ?? false,
                ]);
            }

            foreach ($validated['tips'] as $row) {
                EducationalTip::whereKey($row['id'])->update([
                    'content_id' => $row['content_id'],
                    'content_en' => $row['content_en'] ?? '',
                    'is_active' => $row['is_active'] ?? false,
                ]);
            }
        });

        AuditLogger::record('update_scoring_settings', 'ScoringSetting', null, $oldValue, [
            'thresholds' => $validated['thresholds'],
            'tips' => $validated['tips'],
        ]);

        return redirect()->route('admin.scoring.index')
            ->with('success', 'Bobot, kategori, dan tips edukasi berhasil diperbarui.');
    }

    private function modules(): array
    {
        return collect([
            'digital_literacy' => 'Literasi Digital',
            'data_security' => 'Keamanan Digital',
        ])->map(fn (string $label, string $module) => [
            'key' => $module,
            'label' => $label,
            'thresholds' => CategoryThreshold::where('module', $module)
                ->orderBy('minimum_percentage')
                ->get(),
            'tips' => EducationalTip::where('module', $module)
                ->orderByRaw("CASE category WHEN 'low' THEN 1 WHEN 'medium' THEN 2 WHEN 'high' THEN 3 ELSE 4 END")
                ->orderBy('category')
                ->get(),
        ])->values()->all();
    }
}
