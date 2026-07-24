<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'participant_id',
        'result_token',
        'test_type',
        'language',
        'status',
        'digital_literacy_score',
        'digital_literacy_max_score',
        'digital_literacy_percentage',
        'digital_literacy_category',
        'data_security_score',
        'data_security_max_score',
        'data_security_percentage',
        'data_security_category',
        'submitted_at',
        'current_step',
        'current_question_id',
        'started_at',
        'last_activity_at',
        'completed_at',
    ];

    protected $casts = [
        'digital_literacy_score' => 'decimal:2',
        'digital_literacy_max_score' => 'decimal:2',
        'digital_literacy_percentage' => 'decimal:2',
        'data_security_score' => 'decimal:2',
        'data_security_max_score' => 'decimal:2',
        'data_security_percentage' => 'decimal:2',
        'submitted_at' => 'datetime',
        'started_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(SubmissionAnswer::class);
    }

    public function currentQuestion(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'current_question_id');
    }
}
