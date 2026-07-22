export interface Activity {
    id: number;
    name: string;
    theme?: string | null;
    description?: string | null;
    location?: string | null;
    start_date: string;
    end_date: string;
    is_active: boolean;
    participants_count?: number;
    submissions_count?: number;
}

export interface School {
    id: number;
    name: string;
    address?: string | null;
    is_active?: boolean;
    participants_count?: number;
}

export interface AnswerOption {
    id?: number;
    question_id?: number;
    label_id: string;
    label_en?: string | null;
    weight: number | string;
    display_order?: number;
    is_active?: boolean;
}

export interface Question {
    id: number;
    module: 'digital_literacy' | 'data_security';
    text_id: string;
    text_en?: string | null;
    display_order?: number;
    is_active: boolean;
    answer_options?: AnswerOption[];
}
