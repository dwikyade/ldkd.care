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

    public function printable(Request $request): Response
    {
        $module = in_array($request->query('module'), ['digital_literacy', 'data_security', 'all'], true)
            ? $request->query('module')
            : 'all';
        $pillar = in_array($request->query('pillar'), ['digital_skill', 'digital_ethics', 'digital_safety', 'digital_culture'], true)
            ? $request->query('pillar')
            : null;
        $versionId = $request->integer('version_id') ?: null;
        $version = $versionId
            ? QuestionnaireVersion::find($versionId)
            : QuestionnaireVersion::active();

        $questions = Question::with([
                'questionnaireVersion',
                'responseScale',
                'answerOptions' => fn ($query) => $query->where('is_active', true)->orderBy('display_order'),
            ])
            ->where('is_active', true)
            ->when($version?->id, fn ($query) => $query->where('questionnaire_version_id', $version->id))
            ->when($module !== 'all', fn ($query) => $query->where('module', $module))
            ->when($pillar, fn ($query) => $query->where('kominfo_pillar', $pillar))
            ->orderByRaw("CASE module WHEN 'digital_literacy' THEN 0 WHEN 'data_security' THEN 1 ELSE 2 END")
            ->orderByRaw("CASE kominfo_pillar WHEN 'digital_skill' THEN 0 WHEN 'digital_ethics' THEN 1 WHEN 'digital_culture' THEN 2 WHEN 'digital_safety' THEN 3 ELSE 4 END")
            ->orderBy('display_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Question $question) => [
                'id' => $question->id,
                'module' => $question->module,
                'module_label' => $this->moduleLabel($question->module),
                'kominfo_pillar' => $question->kominfo_pillar,
                'pillar_label' => $this->pillarLabel($question->kominfo_pillar),
                'text_id' => $question->text_id,
                'text_en' => $question->text_en,
                'display_order' => $question->display_order,
                'question_type' => $question->question_type,
                'response_scale' => $question->responseScale?->name_id,
                'answer_options' => $question->answerOptions->map(fn ($option) => [
                    'id' => $option->id,
                    'label_id' => $option->label_id,
                    'label_en' => $option->label_en,
                    'display_order' => $option->display_order,
                ])->values(),
            ])
            ->values();

        return Inertia::render('Admin/Questions/Print', [
            'questions' => $questions,
            'version' => $version ? $version->only(['id', 'name', 'code', 'status']) : null,
            'filters' => [
                'module' => $module,
                'pillar' => $pillar,
                'version_id' => $version?->id,
            ],
            'printedAt' => now()->format('d M Y H:i'),
            'sourceNote' => 'Instrumen adaptasi berbasis Indeks Literasi Digital Indonesia 2022 dan dipetakan menggunakan UNESCO Digital Literacy Global Framework.',
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

    private function moduleLabel(?string $module): string
    {
        return match ($module) {
            'digital_literacy' => 'Literasi Digital',
            'data_security' => 'Keamanan Digital',
            default => '-',
        };
    }

    private function pillarLabel(?string $pillar): string
    {
        return match ($pillar) {
            'digital_skill' => 'Digital Skill',
            'digital_ethics' => 'Digital Ethics',
            'digital_safety' => 'Digital Safety',
            'digital_culture' => 'Digital Culture',
            default => '-',
        };
    }
}
