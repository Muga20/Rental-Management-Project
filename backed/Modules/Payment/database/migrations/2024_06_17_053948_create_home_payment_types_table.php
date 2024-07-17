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
        Schema::create('home_payment_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('home_id');
            $table->uuid('payment_channels_id');

            $table->string('account_payBill')->nullable();
            $table->string('account_number');
            $table->string('status');
            $table->string('image_url');

            // Define foreign key constraints
            $table->foreign('home_id')->references('id')->on('homes')->onDelete('cascade');
            $table->foreign('payment_channels_id')->references('id')->on('payment_channels')->onDelete('cascade');

            // Indexes
            $table->index('home_id');
            $table->index('payment_channels_id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_payment_types');
    }
};
