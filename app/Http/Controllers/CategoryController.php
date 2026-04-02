<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index(): Response
    {
        $categories = auth()->user()->categories()->latest()->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create(): Response
    {
        return Inertia::render('Categories/Create');
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:income,expense',
            'color' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        auth()->user()->categories()->create($validated);

        return redirect()->route('categories.index');
    }

    /**
     * Display the specified category.
     */
    public function show(Category $category): Response
    {
        $this->authorizeUser($category);

        return Inertia::render('Categories/Show', [
            'category' => $category->load('transactions'),
        ]);
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(Category $category): Response
    {
        $this->authorizeUser($category);

        return Inertia::render('Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, Category $category)
    {
        $this->authorizeUser($category);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:income,expense',
            'color' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        $category->update($validated);

        return redirect()->route('categories.index');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category)
    {
        $this->authorizeUser($category);

        $category->delete();

        return redirect()->route('categories.index');
    }

    /**
     * Ensure the authenticated user owns the category.
     */
    private function authorizeUser(Category $category): void
    {
        abort_unless($category->user_id === auth()->id(), 403);
    }
}
