<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of the transactions.
     */
    public function index(): Response
    {
        $transactions = auth()->user()
            ->transactions()
            ->with('category')
            ->latest('date')
            ->paginate(15);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for creating a new transaction.
     */
    public function create(): Response
    {
        $categories = auth()->user()->categories()->get();

        return Inertia::render('Transactions/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created transaction in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|string|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'date' => 'required|date',
        ]);

        // Ensure the category belongs to the user
        $category = auth()->user()->categories()->findOrFail($validated['category_id']);

        auth()->user()->transactions()->create($validated);

        return redirect()->route('transactions.index');
    }

    /**
     * Display the specified transaction.
     */
    public function show(Transaction $transaction): Response
    {
        $this->authorizeUser($transaction);

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction->load('category'),
        ]);
    }

    /**
     * Show the form for editing the specified transaction.
     */
    public function edit(Transaction $transaction): Response
    {
        $this->authorizeUser($transaction);

        $categories = auth()->user()->categories()->get();

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction->load('category'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified transaction in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        $this->authorizeUser($transaction);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|string|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'date' => 'required|date',
        ]);

        // Ensure the category belongs to the user
        $category = auth()->user()->categories()->findOrFail($validated['category_id']);

        $transaction->update($validated);

        return redirect()->route('transactions.index');
    }

    /**
     * Remove the specified transaction from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $this->authorizeUser($transaction);

        $transaction->delete();

        return redirect()->route('transactions.index');
    }

    /**
     * Ensure the authenticated user owns the transaction.
     */
    private function authorizeUser(Transaction $transaction): void
    {
        abort_unless($transaction->user_id === auth()->id(), 403);
    }
}
