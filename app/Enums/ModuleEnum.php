<?php

namespace App\Enums;

enum ModuleEnum: string
{
    case DIGITAL_LITERACY = 'digital_literacy';
    case DATA_SECURITY = 'data_security';

    public function label(): string
    {
        return match ($this) {
            self::DIGITAL_LITERACY => 'Literasi Digital',
            self::DATA_SECURITY => 'Keamanan Data',
        };
    }
}
