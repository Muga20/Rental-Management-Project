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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('stkPush_id');
            $table->uuid('plan_id');
            $table->uuid('company_id');

            $table->timestamps();

            // Define foreign key constraints
            $table->foreign('stkPush_id')->references('id')->on('stkrequests')->onDelete('cascade');
            $table->foreign('plan_id')->references('id')->on('plans');
            $table->foreign('company_id')->references('id')->on('companies');

            // Indexes
            $table->index('stkPush_id');
            $table->index('plan_id');
            $table->index('company_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
