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
        Schema::create('encounters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_chief_complaint_id')->constrained();
            $table->tinyInteger('is_active')->default(1)->index();
            $table->foreignId('call_log_id')->constrained();
            $table->foreignId('patient_condition_id')->constrained();
            $table->foreignId('consultation_status_id')->constrained();
            $table->tinyInteger('is_follow_up')->default(0)->index();
            $table->bigInteger('locked_by')->nullable($value = true)->unsigned();
            $table->foreign('locked_by')->references('id')->on('users')->unsigned();
            $table->datetime('locked_at')->nullable($value = true)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encounters');
    }
};
