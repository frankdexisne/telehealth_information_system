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
        Schema::create('teleserve_patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_profile_id')->nullable($value = true)->constrained();
            $table->string('lname')->nullable($value = true)->index();
            $table->string('fname')->nullable($value = true)->index();
            $table->string('mname')->nullable($value = true)->index();
            $table->string('suffix')->nullable($value = true);
            $table->string('contact_no')->nullable($value = true);
            $table->string('hpercode')->nullable($value = true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teleserve_patients');
    }
};
