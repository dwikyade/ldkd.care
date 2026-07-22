<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

class AuditLogger
{
    public static function record(
        string $action,
        string|Model|null $entity = null,
        ?int $entityId = null,
        ?array $oldValue = null,
        ?array $newValue = null,
    ): void {
        if ($entity instanceof Model) {
            $entityId = $entity->getKey();
            $entity = class_basename($entity);
        }

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'entity_type' => $entity,
            'entity_id' => $entityId,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
        ]);
    }
}
