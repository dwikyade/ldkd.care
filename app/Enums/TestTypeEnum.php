<?php

namespace App\Enums;

enum TestTypeEnum: string
{
    case PRE_TEST = 'pre_test';
    case POST_TEST = 'post_test';

    public function label(): string
    {
        return match ($this) {
            self::PRE_TEST => 'Pre-Test',
            self::POST_TEST => 'Post-Test',
        };
    }
}
