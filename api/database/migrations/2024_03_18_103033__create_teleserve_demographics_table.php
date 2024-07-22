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
        Schema::create('teleserve_demographics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teleserve_patient_id')->constrained();
            $table->string('regcode')->nullable($value = true);
            $table->string('provcode')->nullable($value = true);
            $table->string('ctycode')->nullable($value = true);
            $table->string('brg')->nullable($value = true);
            $table->string('patstr')->nullable($value = true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teleserve_demographics');
    }
};
