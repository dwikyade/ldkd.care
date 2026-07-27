<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionnaireVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'source_reference',
        'status',
        'active_from',
        'active_until',
    ];

    protected $casts = [
        'active_from' => 'datetime',
        'active_until' => 'datetime',
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public static function active(): ?self
    {
        $now = now();

        return self::query()
            ->where('status', 'active')
            ->where(function ($query) use ($now) {
                $query->whereNull('active_from')->orWhere('active_from', '<=', $now);
            })
            ->where(function ($query) use ($now) {
                $query->whereNull('active_until')->orWhere('active_until', '>=', $now);
            })
            ->orderByDesc('active_from')
            ->orderByDesc('id')
            ->first();
    }
}
