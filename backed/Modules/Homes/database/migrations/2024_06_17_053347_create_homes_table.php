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
        Schema::create('homes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('location');
            $table->text('images')->nullable();
            $table->text('coverPhoto')->nullable();
            $table->string('houseCategory');
            $table->string('stories')->nullable();
            $table->string('status')->nullable();
            $table->string('description')->nullable();
            $table->string('rentPaymentDay')->nullable();

            $table->foreignUuid('landlord_id')->nullable()->constrained('users');
            $table->foreignUuid('company_id')->constrained('companies')->onDelete('cascade');

            $table->timestamps();

            // Indexes
            $table->index('landlord_id');
            $table->index('company_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homes');
    }
};
