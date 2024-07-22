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
        Schema::create('consultation_additional_advice', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_consultation_id')->constrained();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->tinyInteger('sent_to_patient')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultation_addition_advice');
    }
};
