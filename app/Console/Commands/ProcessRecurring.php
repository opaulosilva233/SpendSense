<?php

namespace App\Console\Commands;

use App\Models\RecurringTransaction;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessRecurring extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-recurring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process recurring transactions and create entries in the transactions table';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $today = Carbon::today();
        $currentDay = $today->day;
        $lastDayOfMonth = $today->daysInMonth;

        // Get all recurring transactions that match today's day_of_month
        // Also handle cases where day_of_month > last day of month (e.g., 31 in February)
        $recurringTransactions = RecurringTransaction::where(function ($query) use ($currentDay, $lastDayOfMonth) {
            $query->where('day_of_month', $currentDay);

            // If today is the last day of the month, also pick up any recurring
            // transactions scheduled for days beyond this month's length
            if ($currentDay === $lastDayOfMonth) {
                $query->orWhere('day_of_month', '>', $lastDayOfMonth);
            }
        })->get();

        $created = 0;

        foreach ($recurringTransactions as $recurring) {
            // Skip if we already created a transaction this month
            if ($recurring->last_created_at &&
                $recurring->last_created_at->month === $today->month &&
                $recurring->last_created_at->year === $today->year) {
                continue;
            }

            // Create the transaction
            Transaction::create([
                'user_id' => $recurring->user_id,
                'category_id' => $recurring->category_id,
                'type' => $recurring->type,
                'amount' => $recurring->amount,
                'description' => $recurring->description,
                'date' => $today->toDateString(),
            ]);

            // Update last_created_at
            $recurring->update(['last_created_at' => $today]);

            $created++;
        }

        $this->info("Processed {$recurringTransactions->count()} recurring transaction(s). Created {$created} new transaction(s).");

        return Command::SUCCESS;
    }
}
