# 💰 SpendSense (Personal Finance Tracker)

> Your personal finance manager, built for speed, privacy, and optimized for mobile.

**SpendSense** is a web application designed to help you track expenses, monitor income, and visualize your cash flow simply and directly. It is a self-hosted project intended strictly for personal use.

## 🛠️ Tech Stack

* **Backend:** Laravel (PHP)
* **Frontend:** React.js
* **Integration:** Inertia.js (SPA without the need for an external API)
* **Styling:** Tailwind CSS
* **Database:** PostgreSQL
* **Infrastructure:** Docker (Laravel Sail)

## ✨ Key Features (MVP)

* 🔒 **Closed System:** Secure authentication. Only the owner can view the data (`user_id` isolation).
* 📱 **Mobile-First:** Responsive interface focused on quick transaction entry on mobile.
* 🏷️ **Categorization:** Custom categories management with colors and icons.
* 📊 **Dashboard:** Monthly summary displaying current balance, total expenses, and total income.

## 🚀 Running the Project Locally (Docker)

This project uses Laravel Sail, which means you **do not need** to have PHP or Node installed on your local machine, only Docker.

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/tusto-app.git](https://github.com/your-username/tusto-app.git)
   cd tusto-app
   ```

2. Create the environment file:
   ```bash
   cp .env.example .env
   ```

3. Install PHP dependencies using a temporary container:
   ```bash
   docker run --rm -u "$(id -u):$(id -g)" -v "$(pwd):/var/www/html" -w /var/www/html laravelsail/php83-composer:latest composer install --ignore-platform-reqs
   ```

4. Start the Docker containers:
   ```bash
   ./vendor/bin/sail up -d
   ```

5. Generate the app key and run migrations:
   ```bash
   ./vendor/bin/sail artisan key:generate
   ./vendor/bin/sail artisan migrate
   ```

6. Install and build the frontend assets (React/Tailwind):
   ```bash
   ./vendor/bin/sail npm install
   ./vendor/bin/sail npm run build
   ```

The application will be available at `http://localhost`.