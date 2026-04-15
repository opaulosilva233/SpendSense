<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Debt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'counterparty_name',
        'type',
        'amount',
        'paid_amount',
        'status',
        'issue_date',
        'due_date',
        'description',
        'settled_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'issue_date' => 'date',
            'due_date' => 'date',
            'settled_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns this debt entry.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all payments/settlements recorded for this debt.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(DebtPayment::class)->orderByDesc('date');
    }
}
