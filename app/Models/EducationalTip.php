<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducationalTip extends Model
{
    use HasFactory;

    protected $fillable = [
        'module',
        'category',
        'content_id',
        'content_en',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
