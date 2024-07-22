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
        Schema::create('department_has_schedule', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained();
            $table->foreignId('day_id')->constrained();
            $table->time('start_at');
            $table->time('end_at');
            $table->bigInteger('created_by')->nullable($value = true)->unsigned();
            $table->foreign('created_by')->on('users')->references('id')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_has_schedule');
    }
};
