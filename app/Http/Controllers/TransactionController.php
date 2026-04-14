<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TransactionController extends Controller
{
    /**
     * Display a listing of the transactions.
     * Supports filters: category_id, date_from, date_to.
     */
    public function index(Request $request): Response
    {
        $query = auth()->user()
            ->transactions()
            ->with('category')
            ->latest('date');

        // Apply filters
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->input('date_to'));
        }

        $transactions = $query->paginate(15)->withQueryString();

        $categories = auth()->user()->categories()->get();
        $wallets = auth()->user()->wallets()->get();
        $tags = auth()->user()->tags()->get();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'categories' => $categories,
            'wallets' => $wallets,
            'tags' => $tags,
            'filters' => $request->only(['category_id', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Export the user's transactions to a CSV file.
     * Supports the same filters as the index method.
     */
    public function downloadCsv(Request $request): StreamedResponse
    {
        $query = auth()->user()
            ->transactions()
            ->with('category')
            ->latest('date');

        // Apply the same filters as index
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->input('date_to'));
        }

        $transactions = $query->get();

        $filename = 'transactions_'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($transactions) {
            $handle = fopen('php://output', 'w');

            // CSV header
            fputcsv($handle, ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount']);

            // CSV rows
            foreach ($transactions as $transaction) {
                fputcsv($handle, [
                    $transaction->id,
                    $transaction->date->format('Y-m-d'),
                    $transaction->type,
                    $transaction->category->name ?? '',
                    $transaction->description ?? '',
                    $transaction->amount,
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
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
            'wallet_id' => 'nullable|exists:wallets,id',
            'type' => 'required|string|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'date' => 'required|date',
            'qr_code_data' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'receipt' => 'nullable|file|mimes:jpeg,png,pdf|max:5120',
        ]);

        // Ensure the category belongs to the user
        $category = auth()->user()->categories()->findOrFail($validated['category_id']);

        if (! empty($validated['wallet_id'])) {
            auth()->user()->wallets()->findOrFail($validated['wallet_id']);
        }

        $data = collect($validated)->except(['tags', 'receipt'])->toArray();

        if ($request->hasFile('receipt')) {
            $data['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
        }

        $transaction = auth()->user()->transactions()->create($data);

        if (! empty($validated['tags'])) {
            // Ensure all tags belong to user
            $userTags = auth()->user()->tags()->whereIn('id', $validated['tags'])->pluck('id');
            $transaction->tags()->sync($userTags);
        }

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
