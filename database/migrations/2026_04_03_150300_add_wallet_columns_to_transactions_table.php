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
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('wallet_id')->nullable()->after('category_id')->constrained()->nullOnDelete();
            $table->foreignId('to_wallet_id')->nullable()->after('wallet_id')->constrained('wallets')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['to_wallet_id']);
            $table->dropForeign(['wallet_id']);
            $table->dropColumn(['to_wallet_id', 'wallet_id']);
        });
    }
};
