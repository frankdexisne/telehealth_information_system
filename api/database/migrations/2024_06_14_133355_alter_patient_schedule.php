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
            $table->foreignId('encounter_id')->nullable($value = true)->constrained()->after('reason');
            $table->tinyInteger('appeared')->nullable($value = true)->after('encounter_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patient_schedules', function (Blueprint $table) {
            $table->dropForeign(['encounter_id']);
            $table->dropColumn('appeared');
        });
    }
};
