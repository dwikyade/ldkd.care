<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questionnaire_versions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->text('source_reference')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamp('active_from')->nullable();
            $table->timestamp('active_until')->nullable();
            $table->timestamps();

            $table->index(['status', 'active_from', 'active_until']);
        });

        Schema::create('response_scales', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name_id');
            $table->string('name_en');
            $table->text('description_id')->nullable();
            $table->text('description_en')->nullable();
            $table->string('scale_type', 50);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['scale_type', 'is_active']);
        });

        Schema::create('competency_frameworks', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('source_reference')->nullable();
            $table->timestamps();
        });

        Schema::create('competencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competency_framework_id')->nullable()->constrained('competency_frameworks')->nullOnDelete();
            $table->string('framework', 50);
            $table->string('code', 50);
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('competencies')->nullOnDelete();
            $table->timestamps();

            $table->unique(['framework', 'code']);
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->foreignId('questionnaire_version_id')->nullable()->after('id')->constrained('questionnaire_versions')->nullOnDelete();
            $table->string('kominfo_pillar', 50)->nullable()->after('module');
            $table->string('question_type', 50)->default('self_assessment')->after('text_en');
            $table->foreignId('response_scale_id')->nullable()->after('question_type')->constrained('response_scales')->nullOnDelete();
            $table->string('assessment_type', 50)->default('self_assessment')->after('response_scale_id');
            $table->string('difficulty_level', 50)->nullable()->after('assessment_type');
            $table->string('proficiency_level', 50)->nullable()->after('difficulty_level');
            $table->string('unesco_competence_code', 50)->nullable()->after('proficiency_level');
            $table->boolean('is_reverse')->default(false)->after('unesco_competence_code');
            $table->boolean('included_in_score')->default(true)->after('is_reverse');

            $table->index(['questionnaire_version_id', 'module', 'is_active', 'display_order'], 'idx_questions_instrument_module');
            $table->index(['kominfo_pillar', 'is_active'], 'idx_questions_kominfo_pillar');
        });

        Schema::create('question_competencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            $table->foreignId('competency_id')->constrained('competencies')->cascadeOnDelete();
            $table->string('mapping_type', 30)->default('primary');
            $table->timestamps();

            $table->unique(['question_id', 'competency_id', 'mapping_type'], 'unique_question_competency_mapping');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->foreignId('questionnaire_version_id')->nullable()->after('participant_id')->constrained('questionnaire_versions')->nullOnDelete();
            $table->decimal('digital_skill_score', 5, 2)->default(0)->after('data_security_category');
            $table->decimal('digital_ethics_score', 5, 2)->default(0)->after('digital_skill_score');
            $table->decimal('digital_safety_score', 5, 2)->default(0)->after('digital_ethics_score');
            $table->decimal('digital_culture_score', 5, 2)->default(0)->after('digital_safety_score');
            $table->decimal('literacy_score', 5, 2)->default(0)->after('digital_culture_score');
            $table->decimal('security_score', 5, 2)->default(0)->after('literacy_score');
            $table->decimal('total_index', 5, 2)->default(0)->after('security_score');
            $table->decimal('knowledge_score', 5, 2)->nullable()->after('total_index');
            $table->string('literacy_category', 20)->nullable()->after('knowledge_score');
            $table->string('security_category', 20)->nullable()->after('literacy_category');
            $table->string('total_category', 20)->nullable()->after('security_category');
        });

        Schema::table('submission_answers', function (Blueprint $table) {
            $table->string('kominfo_pillar', 50)->nullable()->after('module');
            $table->string('question_type', 50)->nullable()->after('kominfo_pillar');
            $table->string('assessment_type', 50)->nullable()->after('question_type');
            $table->string('response_scale_code', 50)->nullable()->after('assessment_type');
            $table->text('competency_snapshot')->nullable()->after('response_scale_code');
            $table->boolean('included_in_score')->default(true)->after('competency_snapshot');

            $table->index(['submission_id', 'kominfo_pillar'], 'idx_submission_answers_pillar');
        });
    }

    public function down(): void
    {
        Schema::table('submission_answers', function (Blueprint $table) {
            $table->dropIndex('idx_submission_answers_pillar');
            $table->dropColumn([
                'kominfo_pillar',
                'question_type',
                'assessment_type',
                'response_scale_code',
                'competency_snapshot',
                'included_in_score',
            ]);
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('questionnaire_version_id');
            $table->dropColumn([
                'digital_skill_score',
                'digital_ethics_score',
                'digital_safety_score',
                'digital_culture_score',
                'literacy_score',
                'security_score',
                'total_index',
                'knowledge_score',
                'literacy_category',
                'security_category',
                'total_category',
            ]);
        });

        Schema::dropIfExists('question_competencies');

        Schema::table('questions', function (Blueprint $table) {
            $table->dropIndex('idx_questions_instrument_module');
            $table->dropIndex('idx_questions_kominfo_pillar');
            $table->dropConstrainedForeignId('questionnaire_version_id');
            $table->dropConstrainedForeignId('response_scale_id');
            $table->dropColumn([
                'kominfo_pillar',
                'question_type',
                'assessment_type',
                'difficulty_level',
                'proficiency_level',
                'unesco_competence_code',
                'is_reverse',
                'included_in_score',
            ]);
        });

        Schema::dropIfExists('competencies');
        Schema::dropIfExists('competency_frameworks');
        Schema::dropIfExists('response_scales');
        Schema::dropIfExists('questionnaire_versions');
    }
};
