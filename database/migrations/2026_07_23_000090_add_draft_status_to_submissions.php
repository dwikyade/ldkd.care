<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->string('status', 20)->default('draft')->after('language');
            $table->string('current_step', 50)->nullable()->after('submitted_at');
            $table->foreignId('current_question_id')->nullable()->after('current_step')->constrained('questions')->nullOnDelete();
            $table->timestamp('started_at')->nullable()->after('current_question_id');
            $table->timestamp('last_activity_at')->nullable()->after('started_at');
            $table->timestamp('completed_at')->nullable()->after('last_activity_at');
            $table->index(['activity_id', 'participant_id', 'test_type', 'status'], 'idx_submission_status');
        });

        DB::table('submissions')->update([
            'status' => 'completed',
            'started_at' => DB::raw('COALESCE(submitted_at, created_at)'),
            'last_activity_at' => DB::raw('COALESCE(submitted_at, updated_at, created_at)'),
            'completed_at' => DB::raw('submitted_at'),
        ]);

        Schema::table('submission_answers', function (Blueprint $table) {
            $table->foreignId('answer_option_id')->nullable()->after('question_id')->constrained('answer_options')->nullOnDelete();
            $table->unique(['submission_id', 'question_id'], 'unique_submission_question');
        });
    }

    public function down(): void
    {
        Schema::table('submission_answers', function (Blueprint $table) {
            $table->dropUnique('unique_submission_question');
            $table->dropConstrainedForeignId('answer_option_id');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->dropIndex('idx_submission_status');
            $table->dropConstrainedForeignId('current_question_id');
            $table->dropColumn([
                'status',
                'current_step',
                'started_at',
                'last_activity_at',
                'completed_at',
            ]);
        });
    }
};
