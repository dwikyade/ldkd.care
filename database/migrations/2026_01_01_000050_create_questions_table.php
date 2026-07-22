<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string('module', 30); // digital_literacy | data_security
            $table->text('text_id');
            $table->text('text_en');
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['module', 'is_active', 'display_order']);
        });

        Schema::create('answer_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            $table->string('label_id', 191);
            $table->string('label_en', 191);
            $table->decimal('weight', 8, 2);
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['question_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('answer_options');
        Schema::dropIfExists('questions');
    }
};
