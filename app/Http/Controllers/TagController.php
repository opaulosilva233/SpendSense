<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    /**
     * Display a listing of the tags.
     */
    public function index(): Response
    {
        $tags = auth()->user()->tags()->latest()->get();

        return Inertia::render('Tags/Index', [
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created tag in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        auth()->user()->tags()->create($validated);

        return redirect()->route('tags.index');
    }

    /**
     * Update the specified tag in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        $this->authorizeUser($tag);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $tag->update($validated);

        return redirect()->route('tags.index');
    }

    /**
     * Remove the specified tag from storage.
     */
    public function destroy(Tag $tag)
    {
        $this->authorizeUser($tag);

        $tag->delete();

        return redirect()->route('tags.index');
    }

    /**
     * Ensure the authenticated user owns the tag.
     */
    private function authorizeUser(Tag $tag): void
    {
        abort_unless($tag->user_id === auth()->id(), 403);
    }
}
