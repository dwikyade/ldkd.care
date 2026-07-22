<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_thresholds', function (Blueprint $table) {
            $table->id();
            $table->string('module', 30); // digital_literacy | data_security
            $table->string('category', 20); // low | medium | high
            $table->decimal('minimum_percentage', 5, 2);
            $table->decimal('maximum_percentage', 5, 2);
            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['module', 'is_active', 'version']);
        });

        Schema::create('educational_tips', function (Blueprint $table) {
            $table->id();
            $table->string('module', 30); // digital_literacy | data_security
            $table->string('category', 20); // low | medium | high
            $table->text('content_id');
            $table->text('content_en');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['module', 'category', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('educational_tips');
        Schema::dropIfExists('category_thresholds');
    }
};
