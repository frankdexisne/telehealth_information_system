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
        Schema::create('department_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained();
            $table->foreignId('encounter_id')->constrained();
            $table->bigInteger('doctor_id')->nullable()->unsigned();
            $table->foreign('doctor_id')->references('id')->on('users')->unsigned();
            $table->datetime('accomodated_at')->nullable();
            $table->datetime('completed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_assignments');
    }
};
