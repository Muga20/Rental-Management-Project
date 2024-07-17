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
        Schema::create('home_leases', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->decimal('rent_deposit', 10, 2)->default(0)->nullable();
            $table->decimal('additional_fees', 10, 2)->default(0)->nullable();

            $table->foreignUuid('unit_id')->constrained('units')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');

            $table->date('start_date');
            $table->date('end_date')->nullable();

            $table->timestamps();

            $table->index('unit_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_leases');
    }
};
