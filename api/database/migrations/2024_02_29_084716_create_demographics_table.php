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
        Schema::create('demographics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_profile_id')->constrained();
            $table->string('patstr');
            $table->string('brg');
            $table->string('ctycode');
            $table->string('provcode');
            $table->string('regcode')->nullable($value = true);
            $table->string('cntrycode');
            $table->string('patzip');
            $table->string('addstat');
            $table->string('describe')->nullable();
            $table->tinyInteger('link_to_homis')->default(0);
            $table->string('haddr_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demographics');
    }
};
