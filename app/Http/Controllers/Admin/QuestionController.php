<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\AnswerOption;
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

        $questions = Question::with('answerOptions')
            ->where('module', $module)
            ->orderBy('display_order', 'asc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Questions/Index', [
            'questions' => $questions,
            'currentModule' => $module,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Admin/Questions/Form', [
            'defaultModule' => $request->query('module', 'digital_literacy'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'module' => 'required|in:digital_literacy,data_security',
            'text_id' => 'required|string',
            'text_en' => 'nullable|string',
            'is_active' => 'boolean',
            'answer_options' => 'required|array|min:2',
            'answer_options.*.label_id' => 'required|string',
            'answer_options.*.label_en' => 'nullable|string',
            'answer_options.*.weight' => 'required|numeric|min:0|max:100',
        ]);

        $question = DB::transaction(function () use ($validated) {
            $maxOrder = Question::where('module', $validated['module'])->max('display_order') ?? 0;
            
            $question = Question::create([
                'module' => $validated['module'],
                'text_id' => $validated['text_id'],
                'text_en' => $validated['text_en'],
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
        $question->load('answerOptions');
        
        return Inertia::render('Admin/Questions/Form', [
            'question' => $question,
        ]);
    }

    public function update(Request $request, Question $question): RedirectResponse
    {
        $validated = $request->validate([
            'module' => 'required|in:digital_literacy,data_security',
            'text_id' => 'required|string',
            'text_en' => 'nullable|string',
            'is_active' => 'boolean',
            'answer_options' => 'required|array|min:2',
            'answer_options.*.id' => 'nullable|integer',
            'answer_options.*.label_id' => 'required|string',
            'answer_options.*.label_en' => 'nullable|string',
            'answer_options.*.weight' => 'required|numeric|min:0|max:100',
        ]);

        $oldValue = $question->load('answerOptions')->toArray();

        DB::transaction(function () use ($validated, $question) {
            $question->update([
                'module' => $validated['module'],
                'text_id' => $validated['text_id'],
                'text_en' => $validated['text_en'],
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
}
