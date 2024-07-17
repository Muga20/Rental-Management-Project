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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->nullable();
            $table->string('phone_no')->nullable();
            $table->string('password')->nullable();
            $table->string('status')->nullable();
            $table->string('authType')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->string('two_factor_code')->nullable();
            $table->string('two_factor_expires_at')->nullable();
            $table->string('two_fa_status')->nullable();
            $table->uuid('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies');

            $table->timestamps();

            // Indexes
            $table->index('email');
            $table->index('phone_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
