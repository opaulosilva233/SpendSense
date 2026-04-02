# Tusto App - AI Agent Context & Rules

## 1. Project Overview
Tusto is a self-hosted, personal finance tracker designed for speed, privacy, and mobile-first usage. 
- **Code Language:** English (Variables, Models, Database).
- **UI Language:** Portuguese and English (Any user-facing text, buttons, alerts).

## 2. Tech Stack & Environment
- **Backend:** Laravel
- **Frontend:** React + Inertia.js
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **Infrastructure:** Docker (Laravel Sail)

## 3. Strict Rules for the AI Agent
1. **Always use Sail:** You MUST execute all terminal commands through Laravel Sail. 
   - *Example:* Use `./vendor/bin/sail artisan` instead of `php artisan`.
   - *Example:* Use `./vendor/bin/sail npm` instead of `npm`.
2. **Data Isolation:** This is a multi-tenant-like app for personal use. EVERY core model (like Transactions, Categories) MUST have a `user_id` and belong to a `User`. All database queries must be scoped to the currently authenticated user (`auth()->id()`).
3. **Mobile-First UI:** When writing React/Tailwind code, design for mobile screens first (`w-full`, `p-4`), and scale up for desktop (`md:w-1/2`, `lg:p-8`).
4. **No API Routes:** We are using Inertia.js. Do not create REST API routes (`routes/api.php`). Return Inertia responses from standard web controllers (`routes/web.php`).