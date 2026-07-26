<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'questionnaire_version_id',
        'module',
        'kominfo_pillar',
        'text_id',
        'text_en',
        'question_type',
        'response_scale_id',
        'assessment_type',
        'difficulty_level',
        'proficiency_level',
        'unesco_competence_code',
        'is_reverse',
        'included_in_score',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_reverse' => 'boolean',
        'included_in_score' => 'boolean',
        'display_order' => 'integer',
    ];

    public function questionnaireVersion(): BelongsTo
    {
        return $this->belongsTo(QuestionnaireVersion::class);
    }

    public function responseScale(): BelongsTo
    {
        return $this->belongsTo(ResponseScale::class);
    }

    public function answerOptions(): HasMany
    {
        return $this->hasMany(AnswerOption::class)->orderBy('display_order');
    }

    public function competencies(): BelongsToMany
    {
        return $this->belongsToMany(Competency::class, 'question_competencies')
            ->withPivot('mapping_type')
            ->withTimestamps();
    }
}
