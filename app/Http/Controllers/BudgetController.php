<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    /**
     * Display a listing of the budgets.
     */
    public function index(): Response
    {
        $budgets = auth()->user()->budgets()->with('category')->latest()->get();
        // Used for the budget form
        $categories = auth()->user()->categories()->where('type', 'expense')->get();

        return Inertia::render('Budgets/Index', [
            'budgets' => $budgets,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created budget in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0.01',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000|max:2100',
        ]);

        // Ensure category belongs to user
        auth()->user()->categories()->findOrFail($validated['category_id']);

        auth()->user()->budgets()->create($validated);

        return redirect()->route('budgets.index');
    }

    /**
     * Update the specified budget in storage.
     */
    public function update(Request $request, Budget $budget)
    {
        $this->authorizeUser($budget);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0.01',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2000|max:2100',
        ]);

        // Ensure category belongs to user
        auth()->user()->categories()->findOrFail($validated['category_id']);

        $budget->update($validated);

        return redirect()->route('budgets.index');
    }

    /**
     * Remove the specified budget from storage.
     */
    public function destroy(Budget $budget)
    {
        $this->authorizeUser($budget);

        $budget->delete();

        return redirect()->route('budgets.index');
    }

    /**
     * Ensure the authenticated user owns the budget.
     */
    private function authorizeUser(Budget $budget): void
    {
        abort_unless($budget->user_id === auth()->id(), 403);
    }
}
