<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_id',
        'question_id',
        'answer_option_id',
        'question_text_snapshot',
        'option_label_snapshot',
        'weight_snapshot',
        'module',
        'kominfo_pillar',
        'question_type',
        'assessment_type',
        'response_scale_code',
        'competency_snapshot',
        'included_in_score',
    ];

    protected $casts = [
        'weight_snapshot' => 'decimal:2',
        'included_in_score' => 'boolean',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function answerOption(): BelongsTo
    {
        return $this->belongsTo(AnswerOption::class);
    }
}
