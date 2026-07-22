<?php

namespace App\Enums;

enum RoleEnum: string
{
    case STUDENT = 'student';
    case TEACHER = 'teacher';

    public function label(): string
    {
        return match ($this) {
            self::STUDENT => 'Siswa',
            self::TEACHER => 'Guru',
        };
    }
}
