<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->string('participant_code', 50);
            $table->string('full_name', 191);
            $table->string('role', 20); // student | teacher
            $table->foreignId('school_id')->constrained('schools');
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->string('gender', 20)->nullable();
            $table->string('position', 150)->nullable(); // for teachers
            $table->boolean('is_active')->default(true);
            $table->foreignId('merged_into_id')->nullable()->constrained('participants')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['activity_id', 'participant_code'], 'unique_activity_code');
            $table->index(['activity_id', 'role']);
            $table->index(['school_id', 'class_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
