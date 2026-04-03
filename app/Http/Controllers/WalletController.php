<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    /**
     * Display a listing of the wallets.
     */
    public function index(): Response
    {
        $wallets = auth()->user()->wallets()->latest()->get();

        return Inertia::render('Wallets/Index', [
            'wallets' => $wallets,
        ]);
    }

    /**
     * Store a newly created wallet in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric',
        ]);

        auth()->user()->wallets()->create($validated);

        return redirect()->route('wallets.index');
    }

    /**
     * Update the specified wallet in storage.
     */
    public function update(Request $request, Wallet $wallet)
    {
        $this->authorizeUser($wallet);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric',
        ]);

        $wallet->update($validated);

        return redirect()->route('wallets.index');
    }

    /**
     * Remove the specified wallet from storage.
     */
    public function destroy(Wallet $wallet)
    {
        $this->authorizeUser($wallet);

        $wallet->delete();

        return redirect()->route('wallets.index');
    }

    /**
     * Ensure the authenticated user owns the wallet.
     */
    private function authorizeUser(Wallet $wallet): void
    {
        abort_unless($wallet->user_id === auth()->id(), 403);
    }
}
