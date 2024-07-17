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
        Schema::create('home_care_takers', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('home_id');
            $table->foreign('home_id')->references('id')->on('homes')->onDelete('cascade');

            $table->uuid('care_taker_id');
            $table->foreign('care_taker_id')->references('id')->on('users')->onDelete('cascade');

            $table->timestamps();

            // Indexes
            $table->index('home_id');
            $table->index('care_taker_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_care_takers');
    }
};
