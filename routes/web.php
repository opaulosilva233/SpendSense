<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    $now = now();

    // Current balance: total income - total expenses
    $totalIncome = $user->transactions()->where('type', 'income')->sum('amount');
    $totalExpenses = $user->transactions()->where('type', 'expense')->sum('amount');
    $balance = $totalIncome - $totalExpenses;

    // Current month income
    $monthlyIncome = $user->transactions()
        ->where('type', 'income')
        ->whereMonth('date', $now->month)
        ->whereYear('date', $now->year)
        ->sum('amount');

    // Current month expenses
    $monthlyExpenses = $user->transactions()
        ->where('type', 'expense')
        ->whereMonth('date', $now->month)
        ->whereYear('date', $now->year)
        ->sum('amount');

    // 5 most recent transactions with category
    $recentTransactions = $user->transactions()
        ->with('category')
        ->latest('date')
        ->take(5)
        ->get();

    return Inertia::render('Dashboard', [
        'balance' => (float) $balance,
        'monthlyExpenses' => (float) $monthlyExpenses,
        'monthlyIncome' => (float) $monthlyIncome,
        'recentTransactions' => $recentTransactions,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('categories', CategoryController::class);
    Route::resource('transactions', TransactionController::class);
});

require __DIR__.'/auth.php';

