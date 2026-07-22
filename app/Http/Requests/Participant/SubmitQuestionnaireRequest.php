<?php

namespace App\Http\Requests\Participant;

use Illuminate\Foundation\Http\FormRequest;

class SubmitQuestionnaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'participant_id' => ['required', 'integer', 'exists:participants,id'],
            'test_type' => ['required', 'string', 'in:pre_test,post_test'],
            'activity_id' => ['required', 'integer', 'exists:activities,id'],
            'language' => ['required', 'string', 'in:id,en'],
            'answers' => ['required', 'array'],
            'answers.*' => ['required', 'integer', 'exists:answer_options,id'],
        ];
    }
}
