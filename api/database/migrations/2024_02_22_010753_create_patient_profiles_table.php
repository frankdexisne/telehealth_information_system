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
        Schema::create('patient_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('hpercode')->nullable();
            $table->string('slug');
            $table->string('fname');
            $table->string('mname');
            $table->string('lname');
            $table->string('suffix')->nullable();
            $table->date('dob');
            $table->string('gender');
            $table->string('contact_no');
            $table->string('occupation');
            $table->string('civil_status');
            $table->string('patcstat')->nullable();
            $table->string('philhealth_member');
            $table->text('address');
            $table->string('informant')->nullable();
            $table->string('fbname')->nullable();
            $table->string('informant_relationship')->nullable();
            $table->tinyInteger('is_pregnant')->default(0);
            $table->string('patempstat')->default('EMPLO');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_profiles');
    }
};
