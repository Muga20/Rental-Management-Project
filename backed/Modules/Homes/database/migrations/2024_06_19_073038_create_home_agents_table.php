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
        Schema::create('home_agents', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('home_id');
            $table->foreign('home_id')->references('id')->on('homes')->onDelete('cascade');

            $table->uuid('agent_id');
            $table->foreign('agent_id')->references('id')->on('users')->onDelete('cascade');

            $table->timestamps();

            // Indexes
            $table->index('home_id');
            $table->index('agent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_agents');
    }
};
