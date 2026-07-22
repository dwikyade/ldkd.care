<?php

namespace App\Http\Requests\Participant;

use Illuminate\Foundation\Http\FormRequest;

class IdentifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'participant_code' => ['required', 'string', 'max:50'],
            'test_type' => ['required', 'string', 'in:pre_test,post_test'],
            'role' => ['required', 'string', 'in:student,teacher'],
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
            'language' => ['nullable', 'string', 'in:id,en'],
        ];
    }
}
