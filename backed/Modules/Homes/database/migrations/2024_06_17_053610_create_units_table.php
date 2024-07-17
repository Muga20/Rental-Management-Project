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
        Schema::create('units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('unit_name');
            $table->string('slug');
            $table->string('number_of_rooms')->nullable();
            $table->double('payableRent', 8, 2)->default(0)->nullable();
            $table->double('payableWaterBill', 8, 2)->default(0)->nullable();
            $table->double('payableGarbageBill', 8, 2)->default(0)->nullable();
            $table->string('paymentPeriod')->nullable();
            $table->string('paymentNumber')->nullable();
            $table->text('damages')->nullable();

            $table->string('currentMeterReading')->nullable();
            $table->string('previousMeterReading')->nullable();

            $table->date('dateOfOccupation')->nullable();
            $table->string('status');

            $table->foreignUuid('home_id')->constrained('homes')->onDelete('cascade');

            $table->timestamps();

            // Index
            $table->index('home_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
