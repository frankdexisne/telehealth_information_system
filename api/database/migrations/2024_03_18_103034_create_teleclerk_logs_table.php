<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('teleclerk_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teleserve_patient_id')->constrained();
            $table->foreignId('encounter_id')->nullable($value = true)->constrained();
            $table->datetime('log_datetime')->index();
            $table->foreignId('platform_id')->constrained();
            $table->string('informant')->index();
            $table->tinyInteger('is_teleconsult')->default(0)->index();
            $table->string('inquiry');
            $table->foreignId('department_id')->nullable($value = true)->constrained();
            $table->string('rx')->nullable($value = true);
            $table->string('remarks')->nullable($value = true);
            $table->string('update')->nullable($value = true);
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teleclerk_logs');
    }
};
