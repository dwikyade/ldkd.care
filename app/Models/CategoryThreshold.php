<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryThreshold extends Model
{
    use HasFactory;

    protected $fillable = [
        'module',
        'category',
        'minimum_percentage',
        'maximum_percentage',
        'version',
        'is_active',
    ];

    protected $casts = [
        'minimum_percentage' => 'decimal:2',
        'maximum_percentage' => 'decimal:2',
        'version' => 'integer',
        'is_active' => 'boolean',
    ];
}
