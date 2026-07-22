<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Participant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'activity_id',
        'participant_code',
        'full_name',
        'role',
        'school_id',
        'class_id',
        'gender',
        'position',
        'is_active',
        'merged_into_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class, 'class_id');
    }

    public function mergedInto(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'merged_into_id');
    }

    public function mergedFrom(): HasMany
    {
        return $this->hasMany(Participant::class, 'merged_into_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}
