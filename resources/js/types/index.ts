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
    classes_count?: number;
    classes?: Classroom[];
}

export interface Classroom {
    id: number;
    school_id: number;
    name: string;
    is_active?: boolean;
    participants_count?: number;
}

export interface Participant {
    id: number;
    activity_id: number;
    participant_code: string;
    full_name: string;
    role: 'student' | 'teacher';
    school_id: number;
    class_id?: number | null;
    gender?: string | null;
    position?: string | null;
    is_active: boolean;
    submissions_count?: number;
    activity?: Pick<Activity, 'id' | 'name'>;
    school?: Pick<School, 'id' | 'name'>;
    classroom?: Pick<Classroom, 'id' | 'name'> | null;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    from?: number | null;
    to?: number | null;
    links?: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface SubmissionResult {
    id: number;
    test_type: 'pre_test' | 'post_test';
    digital_literacy_percentage: number | string;
    digital_literacy_category: string;
    data_security_percentage: number | string;
    data_security_category: string;
    submitted_at?: string | null;
    participant?: Participant | null;
    activity?: Pick<Activity, 'id' | 'name'> | null;
}

export interface CategoryThreshold {
    id: number;
    module: 'digital_literacy' | 'data_security';
    category: 'low' | 'medium' | 'high';
    minimum_percentage: number | string;
    maximum_percentage: number | string;
    version: number;
    is_active: boolean;
}

export interface EducationalTip {
    id: number;
    module: 'digital_literacy' | 'data_security';
    category: 'low' | 'medium' | 'high';
    content_id: string;
    content_en?: string | null;
    is_active: boolean;
}

export interface AuditLog {
    id: number;
    user_id?: number | null;
    action: string;
    entity_type?: string | null;
    entity_id?: number | null;
    old_value?: Record<string, unknown> | unknown[] | null;
    new_value?: Record<string, unknown> | unknown[] | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
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
