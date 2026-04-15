<?php

namespace Tests\Feature;

use App\Models\Debt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DebtManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_a_debt_record(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->withSession(['_token' => 'test-token'])
            ->post('/debts', [
                '_token' => 'test-token',
                'counterparty_name' => 'Ana Costa',
                'type' => 'payable',
                'amount' => 150.50,
                'issue_date' => '2026-04-10',
                'due_date' => '2026-04-20',
                'description' => 'Empréstimo para reparação',
            ]);

        $response->assertRedirect('/debts');

        $this->assertDatabaseHas('debts', [
            'user_id' => $user->id,
            'counterparty_name' => 'Ana Costa',
            'type' => 'payable',
            'status' => 'open',
        ]);
    }

    public function test_user_cannot_update_other_users_debt(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();

        $debt = Debt::create([
            'user_id' => $owner->id,
            'counterparty_name' => 'Carlos',
            'type' => 'receivable',
            'amount' => 300,
            'paid_amount' => 0,
            'status' => 'open',
            'issue_date' => '2026-04-01',
            'due_date' => '2026-04-30',
            'description' => null,
        ]);

        $this
            ->actingAs($intruder)
            ->withSession(['_token' => 'test-token'])
            ->put('/debts/'.$debt->id, [
                '_token' => 'test-token',
                'counterparty_name' => 'Alterado',
                'type' => 'receivable',
                'amount' => 300,
                'issue_date' => '2026-04-01',
                'due_date' => '2026-04-30',
                'description' => null,
            ])
            ->assertForbidden();
    }

    public function test_partial_payment_updates_paid_amount_and_keeps_open_status(): void
    {
        $user = User::factory()->create();

        $debt = Debt::create([
            'user_id' => $user->id,
            'counterparty_name' => 'Miguel',
            'type' => 'receivable',
            'amount' => 500,
            'paid_amount' => 0,
            'status' => 'open',
            'issue_date' => '2026-04-01',
            'due_date' => '2026-05-01',
            'description' => null,
        ]);

        $response = $this
            ->actingAs($user)
            ->withSession(['_token' => 'test-token'])
            ->post('/debts/'.$debt->id.'/payments', [
                '_token' => 'test-token',
                'amount' => 120,
                'date' => '2026-04-15',
                'note' => 'Pagamento parcial',
            ]);

        $response->assertRedirect('/debts');

        $debt->refresh();

        $this->assertSame('120.00', $debt->paid_amount);
        $this->assertSame('open', $debt->status);

        $this->assertDatabaseHas('debt_payments', [
            'debt_id' => $debt->id,
            'user_id' => $user->id,
            'amount' => '120.00',
        ]);
    }

    public function test_payment_cannot_exceed_remaining_amount(): void
    {
        $user = User::factory()->create();

        $debt = Debt::create([
            'user_id' => $user->id,
            'counterparty_name' => 'Loja X',
            'type' => 'payable',
            'amount' => 200,
            'paid_amount' => 150,
            'status' => 'open',
            'issue_date' => '2026-04-01',
            'due_date' => '2026-04-20',
            'description' => null,
        ]);

        $response = $this
            ->from('/debts')
            ->actingAs($user)
            ->withSession(['_token' => 'test-token'])
            ->post('/debts/'.$debt->id.'/payments', [
                '_token' => 'test-token',
                'amount' => 60,
                'date' => '2026-04-15',
                'note' => null,
            ]);

        $response
            ->assertRedirect('/debts')
            ->assertSessionHasErrors(['amount']);

        $debt->refresh();

        $this->assertSame('150.00', $debt->paid_amount);
        $this->assertDatabaseCount('debt_payments', 0);
    }
}
