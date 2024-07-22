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
        Schema::table('patient_schedules', function (Blueprint $table) {
            $table->nullableMorphs('appointmentable');
            $table->foreignId('department_id')->nullable($value = true)->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patient_schedules', function (Blueprint $table) {
            $table->dropMorphs('appointmentable');
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');
        });
    }
};
