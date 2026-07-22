<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('activities');
            $table->foreignId('participant_id')->constrained('participants');
            $table->char('result_token', 64)->unique();
            $table->string('test_type', 20); // pre_test | post_test
            $table->string('language', 5)->default('id'); // id | en
            // Digital Literacy scores
            $table->decimal('digital_literacy_score', 10, 2)->default(0);
            $table->decimal('digital_literacy_max_score', 10, 2)->default(0);
            $table->decimal('digital_literacy_percentage', 5, 2)->default(0);
            $table->string('digital_literacy_category', 20)->nullable();
            // Data Security scores
            $table->decimal('data_security_score', 10, 2)->default(0);
            $table->decimal('data_security_max_score', 10, 2)->default(0);
            $table->decimal('data_security_percentage', 5, 2)->default(0);
            $table->string('data_security_category', 20)->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->unique(['activity_id', 'participant_id', 'test_type'], 'unique_participant_test');
            $table->index(['activity_id', 'test_type']);
            $table->index('participant_id');
        });

        Schema::create('submission_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('submissions')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions');
            $table->text('question_text_snapshot');
            $table->string('option_label_snapshot', 191);
            $table->decimal('weight_snapshot', 8, 2);
            $table->string('module', 30);
            $table->timestamps();

            $table->index(['submission_id', 'module']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submission_answers');
        Schema::dropIfExists('submissions');
    }
};
