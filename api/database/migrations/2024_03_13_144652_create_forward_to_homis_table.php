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
        Schema::create('forward_to_homis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('encounter_id')->constrained();
            $table->tinyInteger('sent')->default(0);
            $table->foreignId('user_id')->nullable($value = true);
            $table->bigInteger('created_by')->unsigned();
            $table->foreign('created_by')->references('id')->on('users')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forward_to_homis');
    }
};
