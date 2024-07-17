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
        Schema::create('payment_channels', function (Blueprint $table) {

            $table->uuid('id')->primary();
            $table->string('channel_name');
            $table->string('slug');
            $table->string('status');
            $table->string('channel_logo');

            $table->uuid('payment_type_id');

            // Define foreign key constraint
            $table->foreign('payment_type_id')->references('id')->on('payment_types')->onDelete('cascade');

            $table->timestamps();

            // Index
            $table->index('payment_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_channels');
    }
};
