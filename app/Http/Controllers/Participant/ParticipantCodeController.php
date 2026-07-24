<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Services\ParticipantCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ParticipantCodeController extends Controller
{
    public function __construct(private ParticipantCodeService $codeService)
    {
    }

    public function check(Request $request): JsonResponse
    {
        $data = $request->validate([
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
            'suffix' => ['required', 'string', 'max:10'],
        ]);

        $suffix = $this->codeService->extractSuffix($data['suffix']);

        if (! $this->codeService->isValidSuffix($suffix)) {
            throw ValidationException::withMessages([
                'suffix' => 'Kode harus terdiri dari 4-5 huruf atau angka.',
            ]);
        }

        $available = $this->codeService->isAvailable((int) $data['activity_id'], $suffix);

        return response()->json([
            'suffix' => $this->codeService->normalizeSuffix($suffix),
            'code' => $this->codeService->makeCode($suffix),
            'available' => $available,
            'message' => $available
                ? 'Kode ini tersedia dan dapat digunakan.'
                : 'Kode sudah digunakan. Pilih kode lain.',
        ]);
    }

    public function generate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
        ]);

        $activity = Activity::where('is_active', true)->findOrFail($data['activity_id']);
        $suffix = $this->codeService->generateUniqueSuffix($activity->id);

        return response()->json([
            'suffix' => $suffix,
            'code' => $this->codeService->makeCode($suffix),
            'available' => true,
        ]);
    }
}
