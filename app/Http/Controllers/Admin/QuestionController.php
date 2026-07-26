<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuestionnaireVersion;
use App\Models\ResponseScale;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    public function index(Request $request): Response
    {
        $module = $request->query('module', 'digital_literacy');
        $pillar = $request->query('pillar');
        $versionId = $request->query('version_id');

        $questions = Question::with(['answerOptions', 'questionnaireVersion', 'responseScale'])
            ->where('module', $module)
            ->when($pillar, fn ($query) => $query->where('kominfo_pillar', $pillar))
            ->when($versionId, fn ($query) => $query->where('questionnaire_version_id', $versionId))
            ->orderBy('display_order', 'asc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Questions/Index', [
            'questions' => $questions,
            'currentModule' => $module,
            'currentPillar' => $pillar,
            'currentVersionId' => $versionId ? (int) $versionId : null,
            ...$this->instrumentProps(),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Admin/Questions/Form', [
            'defaultModule' => $request->query('module', 'digital_literacy'),
            ...$this->instrumentProps(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'module' => 'required|in:digital_literacy,data_security',
            'questionnaire_version_id' => 'nullable|exists:questionnaire_versions,id',
            'kominfo_pillar' => 'nullable|in:digital_skill,digital_ethics,digital_safety,digital_culture',
            'text_id' => 'required|string',
            'text_en' => 'nullable|string',
            'question_type' => 'required|string|max:50',
            'response_scale_id' => 'nullable|exists:response_scales,id',
            'assessment_type' => 'required|string|max:50',
            'difficulty_level' => 'nullable|string|max:50',
            'proficiency_level' => 'nullable|string|max:50',
            'unesco_competence_code' => 'nullable|string|max:50',
            'is_reverse' => 'boolean',
            'included_in_score' => 'boolean',
            'is_active' => 'boolean',
            'answer_options' => 'required|array|min:2',
            'answer_options.*.label_id' => 'required|string',
            'answer_options.*.label_en' => 'nullable|string',
            'answer_options.*.weight' => 'required|numeric|min:0|max:5',
        ]);

        $question = DB::transaction(function () use ($validated) {
            $versionId = $validated['questionnaire_version_id'] ?? QuestionnaireVersion::active()?->id;
            $maxOrder = Question::when($versionId, fn ($query) => $query->where('questionnaire_version_id', $versionId))->max('display_order') ?? 0;
            
            $question = Question::create([
                'questionnaire_version_id' => $versionId,
                'module' => $validated['module'],
                'kominfo_pillar' => $validated['kominfo_pillar'] ?? $this->defaultPillar($validated['module']),
                'text_id' => $validated['text_id'],
                'text_en' => $validated['text_en'],
                'question_type' => $validated['question_type'],
                'response_scale_id' => $validated['response_scale_id'] ?? null,
                'assessment_type' => $validated['assessment_type'],
                'difficulty_level' => $validated['difficulty_level'] ?? null,
                'proficiency_level' => $validated['proficiency_level'] ?? null,
                'unesco_competence_code' => $validated['unesco_competence_code'] ?? null,
                'is_reverse' => $validated['is_reverse'] ?? false,
                'included_in_score' => $validated['included_in_score'] ?? true,
                'is_active' => $validated['is_active'] ?? true,
                'display_order' => $maxOrder + 1,
            ]);

            foreach ($validated['answer_options'] as $index => $option) {
                $question->answerOptions()->create([
                    'label_id' => $option['label_id'],
                    'label_en' => $option['label_en'],
                    'weight' => $option['weight'],
                    'display_order' => $index + 1,
                ]);
            }

            return $question->load('answerOptions');
        });

        AuditLogger::record('create_question', $question, null, null, $question->toArray());

        return redirect()->route('admin.questions.index', ['module' => $validated['module']])
            ->with('success', 'Soal kuesioner berhasil ditambahkan.');
    }

    public function edit(Question $question): Response
    {
        $question->load(['answerOptions', 'questionnaireVersion', 'responseScale']);
        
        return Inertia::render('Admin/Questions/Form', [
            'question' => $question,
            ...$this->instrumentProps(),
        ]);
    }

    public function update(Request $request, Question $question): RedirectResponse
    {
        $validated = $request->validate([
            'module' => 'required|in:digital_literacy,data_security',
            'questionnaire_version_id' => 'nullable|exists:questionnaire_versions,id',
            'kominfo_pillar' => 'nullable|in:digital_skill,digital_ethics,digital_safety,digital_culture',
            'text_id' => 'required|string',
            'text_en' => 'nullable|string',
            'question_type' => 'required|string|max:50',
            'response_scale_id' => 'nullable|exists:response_scales,id',
            'assessment_type' => 'required|string|max:50',
            'difficulty_level' => 'nullable|string|max:50',
            'proficiency_level' => 'nullable|string|max:50',
            'unesco_competence_code' => 'nullable|string|max:50',
            'is_reverse' => 'boolean',
            'included_in_score' => 'boolean',
            'is_active' => 'boolean',
            'answer_options' => 'required|array|min:2',
            'answer_options.*.id' => 'nullable|integer',
            'answer_options.*.label_id' => 'required|string',
            'answer_options.*.label_en' => 'nullable|string',
            'answer_options.*.weight' => 'required|numeric|min:0|max:5',
        ]);

        $oldValue = $question->load('answerOptions')->toArray();

        DB::transaction(function () use ($validated, $question) {
            $question->update([
                'questionnaire_version_id' => $validated['questionnaire_version_id'] ?? $question->questionnaire_version_id,
                'module' => $validated['module'],
                'kominfo_pillar' => $validated['kominfo_pillar'] ?? $this->defaultPillar($validated['module']),
                'text_id' => $validated['text_id'],
                'text_en' => $validated['text_en'],
                'question_type' => $validated['question_type'],
                'response_scale_id' => $validated['response_scale_id'] ?? null,
                'assessment_type' => $validated['assessment_type'],
                'difficulty_level' => $validated['difficulty_level'] ?? null,
                'proficiency_level' => $validated['proficiency_level'] ?? null,
                'unesco_competence_code' => $validated['unesco_competence_code'] ?? null,
                'is_reverse' => $validated['is_reverse'] ?? false,
                'included_in_score' => $validated['included_in_score'] ?? true,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            $existingOptionIds = collect($validated['answer_options'])->pluck('id')->filter()->toArray();
            $question->answerOptions()->whereNotIn('id', $existingOptionIds)->delete();

            foreach ($validated['answer_options'] as $index => $option) {
                if (isset($option['id'])) {
                    $question->answerOptions()->where('id', $option['id'])->update([
                        'label_id' => $option['label_id'],
                        'label_en' => $option['label_en'],
                        'weight' => $option['weight'],
                        'display_order' => $index + 1,
                    ]);
                } else {
                    $question->answerOptions()->create([
                        'label_id' => $option['label_id'],
                        'label_en' => $option['label_en'],
                        'weight' => $option['weight'],
                        'display_order' => $index + 1,
                    ]);
                }
            }
        });

        AuditLogger::record('update_question', $question, null, $oldValue, $question->fresh()->load('answerOptions')->toArray());

        return redirect()->route('admin.questions.index', ['module' => $validated['module']])
            ->with('success', 'Soal kuesioner berhasil diperbarui.');
    }

    public function destroy(Question $question): RedirectResponse
    {
        $module = $question->module;
        $oldValue = $question->load('answerOptions')->toArray();
        $question->delete();

        AuditLogger::record('delete_question', 'Question', $question->id, $oldValue);

        return redirect()->route('admin.questions.index', ['module' => $module])
            ->with('success', 'Soal berhasil dihapus.');
    }

    private function instrumentProps(): array
    {
        return [
            'versions' => QuestionnaireVersion::orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")->orderByDesc('active_from')->orderByDesc('id')->get(['id', 'name', 'code', 'status']),
            'responseScales' => ResponseScale::where('is_active', true)->orderBy('scale_type')->orderBy('name_id')->get(['id', 'code', 'name_id', 'name_en', 'scale_type']),
            'pillarOptions' => [
                ['value' => 'digital_skill', 'label' => 'Digital Skill'],
                ['value' => 'digital_ethics', 'label' => 'Digital Ethics'],
                ['value' => 'digital_safety', 'label' => 'Digital Safety'],
                ['value' => 'digital_culture', 'label' => 'Digital Culture'],
            ],
        ];
    }

    private function defaultPillar(string $module): string
    {
        return $module === 'data_security' ? 'digital_safety' : 'digital_skill';
    }
}
