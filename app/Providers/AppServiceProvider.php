<?php

namespace App\Providers;

use App\Console\Commands\CreateUser;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        if ($this->app->runningInConsole()) {
            $this->commands([
                CreateUser::class,
            ]);
        }
    }
}
