<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class DebtController extends Controller
{
    /**
     * Display a listing of the user's debts and credits.
     */
    public function index(Request $request): Response
    {
        $query = auth()->user()
            ->debts()
            ->with('payments')
            ->latest('created_at');

        if ($request->filled('type')) {
            $query->where('type', (string) $request->string('type'));
        }

        if ($request->filled('status')) {
            $query->where('status', (string) $request->string('status'));
        }

        if ($request->filled('q')) {
            $search = trim((string) $request->string('q'));
            $query->where(function ($subQuery) use ($search) {
                $subQuery
                    ->where('counterparty_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $debts = $query->paginate(12)->withQueryString();

        $base = auth()->user()->debts();
        $openPayables = (clone $base)
            ->where('type', 'payable')
            ->whereIn('status', ['open', 'overdue'])
            ->selectRaw('COALESCE(SUM(amount - paid_amount), 0) as total')
            ->value('total');

        $openReceivables = (clone $base)
            ->where('type', 'receivable')
            ->whereIn('status', ['open', 'overdue'])
            ->selectRaw('COALESCE(SUM(amount - paid_amount), 0) as total')
            ->value('total');

        $overdueCount = (clone $base)
            ->where('status', 'overdue')
            ->count();

        return Inertia::render('Debts/Index', [
            'debts' => $debts,
            'filters' => $request->only(['type', 'status', 'q']),
            'summary' => [
                'open_payables' => (float) $openPayables,
                'open_receivables' => (float) $openReceivables,
                'overdue_count' => (int) $overdueCount,
                'net_position' => (float) $openReceivables - (float) $openPayables,
            ],
        ]);
    }

    /**
     * Store a newly created debt in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'counterparty_name' => 'required|string|max:255',
            'type' => 'required|string|in:payable,receivable',
            'amount' => 'required|numeric|min:0.01',
            'issue_date' => 'required|date',
            'due_date' => 'nullable|date|after_or_equal:issue_date',
            'description' => 'nullable|string|max:1000',
        ]);

        $status = $this->resolveStatus(
            (float) $validated['amount'],
            0,
            $validated['due_date'] ?? null
        );

        auth()->user()->debts()->create([
            ...$validated,
            'paid_amount' => 0,
            'status' => $status,
            'settled_at' => null,
        ]);

        return redirect()->route('debts.index');
    }

    /**
     * Update the specified debt in storage.
     */
    public function update(Request $request, Debt $debt)
    {
        $this->authorizeUser($debt);

        $validated = $request->validate([
            'counterparty_name' => 'required|string|max:255',
            'type' => 'required|string|in:payable,receivable',
            'amount' => 'required|numeric|min:0.01',
            'issue_date' => 'required|date',
            'due_date' => 'nullable|date|after_or_equal:issue_date',
            'description' => 'nullable|string|max:1000',
        ]);

        if ((float) $validated['amount'] < (float) $debt->paid_amount) {
            return back()
                ->withErrors([
                    'amount' => 'O valor total não pode ser inferior ao valor já liquidado.',
                ])
                ->withInput();
        }

        $debt->update([
            ...$validated,
            'status' => $this->resolveStatus(
                (float) $validated['amount'],
                (float) $debt->paid_amount,
                $validated['due_date'] ?? null
            ),
            'settled_at' => (float) $debt->paid_amount >= (float) $validated['amount'] ? now() : null,
        ]);

        return redirect()->route('debts.index');
    }

    /**
     * Register a settlement/payment against a debt.
     */
    public function addPayment(Request $request, Debt $debt)
    {
        $this->authorizeUser($debt);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'note' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($debt, $validated): void {
            $debt->refresh();

            $remaining = (float) $debt->amount - (float) $debt->paid_amount;
            $paymentAmount = (float) $validated['amount'];

            if ($paymentAmount > $remaining) {
                throw ValidationException::withMessages([
                    'amount' => 'O valor da liquidação ultrapassa o montante em aberto.',
                ]);
            }

            $debt->payments()->create([
                'user_id' => auth()->id(),
                'amount' => $paymentAmount,
                'date' => $validated['date'],
                'note' => $validated['note'] ?? null,
            ]);

            $newPaidAmount = (float) $debt->paid_amount + $paymentAmount;

            $debt->update([
                'paid_amount' => $newPaidAmount,
                'status' => $this->resolveStatus(
                    (float) $debt->amount,
                    $newPaidAmount,
                    $debt->due_date?->toDateString()
                ),
                'settled_at' => $newPaidAmount >= (float) $debt->amount ? now() : null,
            ]);
        });

        return redirect()->route('debts.index');
    }

    /**
     * Remove the specified debt from storage.
     */
    public function destroy(Debt $debt)
    {
        $this->authorizeUser($debt);

        $debt->delete();

        return redirect()->route('debts.index');
    }

    /**
     * Ensure the authenticated user owns the debt.
     */
    private function authorizeUser(Debt $debt): void
    {
        abort_unless((int) $debt->user_id === (int) auth()->id(), 403);
    }

    /**
     * Resolve debt status from amounts and due date.
     */
    private function resolveStatus(float $amount, float $paidAmount, ?string $dueDate): string
    {
        if ($paidAmount >= $amount) {
            return 'settled';
        }

        if ($dueDate && now()->toDateString() > $dueDate) {
            return 'overdue';
        }

        return 'open';
    }
}
