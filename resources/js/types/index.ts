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
    digital_skill_score?: number | string;
    digital_ethics_score?: number | string;
    digital_safety_score?: number | string;
    digital_culture_score?: number | string;
    literacy_score?: number | string;
    security_score?: number | string;
    total_index?: number | string;
    literacy_category?: string | null;
    security_category?: string | null;
    total_category?: string | null;
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
    module: 'digital_literacy' | 'data_security' | 'digital_skill' | 'digital_ethics' | 'digital_safety' | 'digital_culture' | 'total_index';
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

export interface QuestionnaireVersion {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'draft' | 'archived' | string;
}

export interface ResponseScale {
    id: number;
    code: string;
    name_id: string;
    name_en?: string | null;
    scale_type: string;
}

export interface Question {
    id: number;
    module: 'digital_literacy' | 'data_security';
    questionnaire_version_id?: number | null;
    questionnaire_version?: QuestionnaireVersion | null;
    kominfo_pillar?: 'digital_skill' | 'digital_ethics' | 'digital_safety' | 'digital_culture' | null;
    question_type?: string | null;
    response_scale_id?: number | null;
    response_scale?: ResponseScale | null;
    assessment_type?: string | null;
    difficulty_level?: string | null;
    proficiency_level?: string | null;
    unesco_competence_code?: string | null;
    is_reverse?: boolean;
    included_in_score?: boolean;
    text_id: string;
    text_en?: string | null;
    display_order?: number;
    is_active: boolean;
    answer_options?: AnswerOption[];
}
