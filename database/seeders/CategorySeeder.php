<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        
        if (!$user) {
            return;
        }

        // Skip if categories already exist for this user
        if (Category::where('user_id', $user->id)->exists()) {
            return;
        }

        $categories = [
            // Despesas
            ['name' => 'Alimentação', 'type' => 'expense', 'icon' => 'food', 'color' => '#FF6B6B'],
            ['name' => 'Transporte', 'type' => 'expense', 'icon' => 'car', 'color' => '#4ECDC4'],
            ['name' => 'Habitação', 'type' => 'expense', 'icon' => 'home', 'color' => '#F7B731'],
            ['name' => 'Saúde', 'type' => 'expense', 'icon' => 'health', 'color' => '#EE5A6F'],
            ['name' => 'Educação', 'type' => 'expense', 'icon' => 'education', 'color' => '#5F27CD'],
            ['name' => 'Entretenimento', 'type' => 'expense', 'icon' => 'entertainment', 'color' => '#FF9FF3'],
            ['name' => 'Vestuário', 'type' => 'expense', 'icon' => 'shopping', 'color' => '#E84393'],
            ['name' => 'Utilidades', 'type' => 'expense', 'icon' => 'utilities', 'color' => '#FFA502'],
            ['name' => 'Pessoal/Higiene', 'type' => 'expense', 'icon' => 'personal', 'color' => '#A29BFE'],
            ['name' => 'Outros', 'type' => 'expense', 'icon' => 'tag', 'color' => '#74B9FF'],

            // Rendimentos
            ['name' => 'Salário', 'type' => 'income', 'icon' => 'briefcase', 'color' => '#00B894'],
            ['name' => 'Freelance', 'type' => 'income', 'icon' => 'laptop', 'color' => '#0984E3'],
            ['name' => 'Investimentos', 'type' => 'income', 'icon' => 'chart', 'color' => '#6C5CE7'],
            ['name' => 'Bónus', 'type' => 'income', 'icon' => 'trophy', 'color' => '#00CEC9'],
            ['name' => 'Outros Rendimentos', 'type' => 'income', 'icon' => 'cash', 'color' => '#27AE60'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'user_id' => $user->id,
                'name' => $category['name'],
                'type' => $category['type'],
                'icon' => $category['icon'],
                'color' => $category['color'],
            ]);
        }
    }
}
